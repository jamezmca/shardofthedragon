/* ─── Cache helpers ─────────────────────────────────────────────────────────── */
const CACHE_GEO_TTL     = 24 * 60 * 60 * 1000; // 24 h
const CACHE_WEATHER_TTL = 30 * 60 * 1000;       // 30 min

function cacheSet(key, data) {
  localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
}

function cacheGet(key, ttl) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > ttl) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

/* ─── WMO weather code → theme ──────────────────────────────────────────────── */
function wmoToTheme(code, apparentTemp) {
  // Thunderstorm
  if (code >= 95) return 'heavy-rain';
  // Heavy snow / blizzard
  if ([75, 77, 85, 86].includes(code)) return 'blizzard';
  // Snow
  if ([71, 73].includes(code) || (code >= 36 && code <= 39)) return 'snowing';
  // Freezing drizzle / sleet
  if ([56, 57, 66, 67].includes(code)) return 'snowing';
  // Heavy rain
  if ([63, 65, 81, 82].includes(code)) return 'heavy-rain';
  // Light / moderate rain
  if ([51, 53, 55, 61].includes(code)) return 'light-rain';
  // Showers
  if ([80].includes(code)) return 'overcast-showers';
  // Fog / depositing rime
  if ([45, 48].includes(code)) return 'overcast';
  // Overcast
  if (code === 3) return 'overcast';
  // Partly cloudy
  if (code === 2) return 'overcast-showers';
  // Mainly clear / clear sky → split on apparent temp
  if (code <= 1) return apparentTemp >= 24 ? 'sunny-hot' : 'sunny-cold';
  return 'overcast';
}

/* ─── Open-Meteo geocoding ───────────────────────────────────────────────────── */
async function geocodeSearch(query) {
  const cacheKey = `geo:${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey, CACHE_GEO_TTL);
  if (cached) return cached;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding request failed');
  const json = await res.json();
  const results = (json.results || []).map(r => ({
    name:      r.name,
    country:   r.country,
    admin1:    r.admin1 || '',
    lat:       r.latitude,
    lon:       r.longitude,
  }));
  cacheSet(cacheKey, results);
  return results;
}

/* ─── Open-Meteo weather fetch ───────────────────────────────────────────────── */
async function fetchWeather(lat, lon) {
  const cacheKey = `wx2:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = cacheGet(cacheKey, CACHE_WEATHER_TTL);
  if (cached) return cached;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=weather_code,apparent_temperature` +
    `&hourly=weather_code,apparent_temperature,precipitation_probability` +
    `&timezone=auto&forecast_days=4`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather request failed');
  const json = await res.json();

  // Find the index of the current hour in the hourly arrays.
  const nowHour = json.current.time.slice(0, 13);
  const currentHourIndex = Math.max(
    0, json.hourly.time.findIndex(t => t.slice(0, 13) === nowHour)
  );

  const result = {
    currentHourIndex,
    hourly: {
      weather_code:             json.hourly.weather_code,
      apparent_temperature:     json.hourly.apparent_temperature,
      precipitation_probability: json.hourly.precipitation_probability,
    },
  };
  cacheSet(cacheKey, result);
  return result;
}

/* ─── DOM refs ───────────────────────────────────────────────────────────────── */
const homeEl       = document.getElementById('home');
const weatherEl    = document.getElementById('weather');
const searchInput  = document.getElementById('search-input');
const suggestionEl = document.getElementById('suggestions');
const uiLocation   = document.getElementById('ui-location');
const uiTemp       = document.getElementById('ui-temp');
const uiRain       = document.getElementById('ui-rain');
const timeNavEl    = document.getElementById('time-nav');
const btnChange    = document.getElementById('btn-change');

/* ─── Forecast offset state ──────────────────────────────────────────────────── */
let selectedOffset = 0;
let currentWx      = null;
let currentName    = '';

/* ─── Routing ────────────────────────────────────────────────────────────────── */
function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    name: p.get('location'),
    lat:  parseFloat(p.get('lat')),
    lon:  parseFloat(p.get('lon')),
  };
}

function pushLocation(name, lat, lon) {
  const url = new URL(location.href);
  url.searchParams.set('location', name);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  history.pushState({}, '', url);
}

function clearLocation() {
  const url = new URL(location.href);
  url.searchParams.delete('location');
  url.searchParams.delete('lat');
  url.searchParams.delete('lon');
  history.pushState({}, '', url);
}

/* ─── Show weather scene ─────────────────────────────────────────────────────── */
async function showWeather(name, lat, lon) {
  try {
    const wx = await fetchWeather(lat, lon);
    currentWx   = wx;
    currentName = name;

    homeEl.hidden    = true;
    weatherEl.hidden = false;

    renderWeather(name, wx, selectedOffset);
    startRefreshTimer(name, lat, lon);
  } catch (err) {
    console.error(err);
    alert('Could not load weather. Please try again.');
  }
}

/* ─── Render weather for a given hour offset ─────────────────────────────────── */
function renderWeather(name, wx, offsetHours) {
  const idx = Math.min(
    wx.currentHourIndex + offsetHours,
    wx.hourly.weather_code.length - 1
  );
  const weatherCode  = wx.hourly.weather_code[idx];
  const apparentTemp = Math.round(wx.hourly.apparent_temperature[idx]);
  const precipPct    = wx.hourly.precipitation_probability[idx] ?? 0;

  const theme = wmoToTheme(weatherCode, apparentTemp);
  document.body.setAttribute('data-theme', theme);

  uiLocation.textContent = name;
  uiTemp.innerHTML       = `${apparentTemp}<span class="ui-temp-unit">°C</span>`;
  uiRain.textContent     = `${precipPct}% chance of rain`;
}

/* ─── Update active time nav button ──────────────────────────────────────────── */
function setActiveOffset(offset) {
  selectedOffset = offset;
  timeNavEl.querySelectorAll('.time-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.offset) === offset);
  });
}

/* ─── Time nav click handler ─────────────────────────────────────────────────── */
timeNavEl.addEventListener('click', e => {
  const btn = e.target.closest('.time-btn');
  if (!btn || !currentWx) return;
  const offset = parseInt(btn.dataset.offset);
  setActiveOffset(offset);
  renderWeather(currentName, currentWx, offset);
});

/* ─── Auto-refresh ───────────────────────────────────────────────────────────── */
let refreshTimer = null;

function startRefreshTimer(name, lat, lon) {
  clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    const cacheKey = `wx:${lat.toFixed(2)},${lon.toFixed(2)}`;
    if (!cacheGet(cacheKey, CACHE_WEATHER_TTL)) {
      showWeather(name, lat, lon);
    }
  }, 5 * 60 * 1000);
}

function stopRefreshTimer() {
  clearInterval(refreshTimer);
  refreshTimer = null;
}

/* ─── Autocomplete search ────────────────────────────────────────────────────── */
let debounceTimer = null;
let activeIndex   = -1;
let currentResults = [];

function renderSuggestions(results) {
  currentResults = results;
  activeIndex = -1;
  suggestionEl.innerHTML = '';

  if (!results.length) {
    suggestionEl.hidden = true;
    return;
  }

  results.forEach((r, i) => {
    const li = document.createElement('li');
    const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
    li.textContent = label;
    li.dataset.index = i;
    li.addEventListener('mousedown', e => {
      e.preventDefault(); // prevent input blur
      selectResult(i);
    });
    suggestionEl.appendChild(li);
  });

  suggestionEl.hidden = false;
}

function highlightItem(index) {
  const items = suggestionEl.querySelectorAll('li');
  items.forEach((li, i) => li.classList.toggle('active', i === index));
}

function selectResult(index) {
  const r = currentResults[index];
  if (!r) return;
  const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
  searchInput.value = label;
  suggestionEl.hidden = true;
  setActiveOffset(0);
  pushLocation(label, r.lat, r.lon);
  showWeather(label, r.lat, r.lon);
}

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const q = searchInput.value.trim();
  if (q.length < 2) { suggestionEl.hidden = true; return; }

  debounceTimer = setTimeout(async () => {
    try {
      const results = await geocodeSearch(q);
      renderSuggestions(results);
    } catch {
      suggestionEl.hidden = true;
    }
  }, 280);
});

searchInput.addEventListener('keydown', e => {
  const items = suggestionEl.querySelectorAll('li');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
    highlightItem(activeIndex);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, -1);
    highlightItem(activeIndex);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (activeIndex >= 0) selectResult(activeIndex);
    else if (currentResults.length) selectResult(0);
  } else if (e.key === 'Escape') {
    suggestionEl.hidden = true;
  }
});

searchInput.addEventListener('blur', () => {
  // short delay so mousedown on suggestion fires first
  setTimeout(() => { suggestionEl.hidden = true; }, 150);
});

btnChange.addEventListener('click', () => {
  stopRefreshTimer();
  clearLocation();
  document.body.removeAttribute('data-theme');
  weatherEl.hidden = true;
  homeEl.hidden    = false;
  searchInput.value = '';
  searchInput.focus();
  setActiveOffset(0);
  currentWx = null;
});

window.addEventListener('popstate', init);

/* ─── Init ───────────────────────────────────────────────────────────────────── */
function init() {
  const { name, lat, lon } = getParams();
  if (name && !isNaN(lat) && !isNaN(lon)) {
    showWeather(name, lat, lon);
  } else {
    homeEl.hidden    = false;
    weatherEl.hidden = true;
    document.body.removeAttribute('data-theme');
    searchInput.focus();
  }
}

init();

/* ─── Dev panel ──────────────────────────────────────────────────────────────── */
if (new URLSearchParams(location.search).get('dev') === 'true') {
  const THEMES = [
    { value: 'sunny-hot',        label: 'Sunny Hot' },
    { value: 'sunny-cold',       label: 'Sunny Cold' },
    { value: 'overcast',         label: 'Overcast' },
    { value: 'overcast-showers', label: 'Overcast + Showers' },
    { value: 'light-rain',       label: 'Light Rain' },
    { value: 'heavy-rain',       label: 'Heavy Rain' },
    { value: 'snowing',          label: 'Snowing' },
    { value: 'blizzard',         label: 'Blizzard' },
  ];

  const panel = document.createElement('div');
  panel.id = 'dev-panel';
  panel.innerHTML =
    `<span class="dev-label">dev</span>` +
    `<select id="dev-select">` +
    `<option value="">pick a theme</option>` +
    THEMES.map(t => `<option value="${t.value}">${t.label}</option>`).join('') +
    `</select>`;
  document.body.appendChild(panel);

  document.getElementById('dev-select').addEventListener('change', e => {
    const theme = e.target.value;
    if (!theme) return;
    document.body.setAttribute('data-theme', theme);
    uiLocation.textContent = 'Dev Mode';
    uiTemp.innerHTML       = `21<span class="ui-temp-unit">°C</span>`;
    uiRain.textContent     = '42% chance of rain';
    homeEl.hidden          = true;
    weatherEl.hidden       = false;
  });
}
