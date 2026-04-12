const fs = require('fs')
const path = require('path')

const root = process.cwd()

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? match[1].trim() : ''
}

function collectApps() {
  const entries = fs.readdirSync(root, { withFileTypes: true })

  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const slug = entry.name
      const htmlPath = path.join(root, slug, 'index.html')

      if (!fs.existsSync(htmlPath)) return null

      const html = fs.readFileSync(htmlPath, 'utf8')
      const title = getTitle(html) || slug

      return { slug, title }
    })
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

const apps = collectApps()

const dragon = [
  "                                                       / \\  //\\\\",
  "                                        |\\___/|      /   \\//  \\\\",
  "                                        /0  0  \\__  /    //  | \\ \\",
  "                                       /     /  \\/_/    //   |  \\  \\",
  "                                       @_^_@'/   \\/_   //    |   \\   \\",
  "                                       //_^_/     \\/_ //     |    \\    \\",
  "                                    ( //) |        \\///      |     \\     \\",
  "                                  ( / /) _|_ /   )  //       |      \\     _\\\\",
  "                                ( // /) '/,_ _ _/  ( ; -.    |    _ _\\\\.-~        .-~~~^-.",
  "                          (( / / )) ,-{        _      `-.|.-~-.           .~         `.",
  "                         (( // / ))  '/\\\\      /                 ~-. _ .-~      .-~^-.  \\",
  "                         (( /// ))      `.   {            }                   /      \\  \\",
  "                          (( / ))     .----~-.\\\\        \\-'                 .~         \\  `. \\^-.",
  "                                     ///.----..>        \\             _ -~             `.  ^-`   ^-_",
  "                                       ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~"
].join('\n')

const linksHtml = apps
  .map(app => {
    const href = `/${encodeURIComponent(app.slug)}/`
    return `<a href="${href}" target="_blank" data-title="${escapeHtml(app.title.toLowerCase())}" data-slug="${escapeHtml(app.slug.toLowerCase())}">${escapeHtml(app.title)}</a>`
  })
  .join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>shardofthedragon | websites for fun</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: monospace;
    }

    body {
      min-height: 100vh;
    }

    #dragon {
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      pointer-events: none;
      white-space: pre;
      line-height: 0.85;
      font-size: 22px;
      opacity: 0.14;
      user-select: none;
      overflow: hidden;
      max-width: none;
    }

    #ui {
      position: relative;
      z-index: 1;
      padding: 6px;
    }

    #search {
      width: 180px;
      font: inherit;
      margin-bottom: 6px;
    }

    #links {
      display: block;
    }

    #links a {
      display: block;
    }

    #count {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <pre id="dragon" aria-hidden="true">${escapeHtml(dragon)}</pre>

  <div id="ui">
    <input id="search" type="text" placeholder="search" autocomplete="off">
    <div id="count">${apps.length} total</div>
    <div id="links">
    <a href="https://github.com/jamezmca/shardofthedragon" target="_blank">github repo ⭐️</a>
${linksHtml}
    </div>
  </div>

  <script>
    const search = document.getElementById('search')
    const links = Array.from(document.querySelectorAll('#links a'))
    const count = document.getElementById('count')

    function fuzzyMatch(query, text) {
      if (!query) return true

      query = query.toLowerCase().trim()
      text = text.toLowerCase()

      if (text.includes(query)) return true

      let qi = 0
      let ti = 0

      while (qi < query.length && ti < text.length) {
        if (query[qi] === text[ti]) qi++
        ti++
      }

      return qi === query.length
    }

    function score(query, text) {
      if (!query) return 0

      query = query.toLowerCase().trim()
      text = text.toLowerCase()

      if (text === query) return 1000
      if (text.startsWith(query)) return 700
      if (text.includes(query)) return 500

      let qi = 0
      let ti = 0
      let gaps = 0
      let lastMatch = -1

      while (qi < query.length && ti < text.length) {
        if (query[qi] === text[ti]) {
          if (lastMatch !== -1) gaps += ti - lastMatch - 1
          lastMatch = ti
          qi++
        }
        ti++
      }

      if (qi !== query.length) return -1

      return 300 - gaps
    }

    function update() {
      const q = search.value.trim().toLowerCase()
      let visible = []

      for (const link of links) {
        const title = link.dataset.title
        const slug = link.dataset.slug

        const titleMatch = fuzzyMatch(q, title)
        const slugMatch = fuzzyMatch(q, slug)
        const show = !q || titleMatch || slugMatch

        link.style.display = show ? 'block' : 'none'

        if (show) {
          visible.push({
            el: link,
            score: Math.max(score(q, title), score(q, slug)),
            title
          })
        }
      }

      if (q) {
        visible.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return a.title.localeCompare(b.title)
        })

        for (const item of visible) {
          item.el.parentNode.appendChild(item.el)
        }
      }

      count.textContent = q ? visible.length + ' match' + (visible.length === 1 ? '' : 'es') : links.length + ' total'
    }

    search.addEventListener('input', update)
    update()
  </script>
</body>
</html>
`

fs.writeFileSync(path.join(root, 'index.html'), html)
console.log('generated brutal dragon homepage with ' + apps.length + ' links')