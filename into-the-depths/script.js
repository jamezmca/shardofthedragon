const FUNCTION_OPS = new Set(["√", "∛", "^2", "^3", "^(2/3)", "^(3/2)", "negate", "1/x"]);

const OP_DISPLAY = {
  "^2":     "x²",
  "^3":     "x³",
  "^(2/3)": "x^(2/3)",
  "^(3/2)": "x^(3/2)",
  "negate": "−x",
  "1/x":    "1/x",
};

// 🎁 is always this many layers away
const DEPTH = { easy: 2, medium: 3, hard: 4 };

// Layer types available per difficulty
const OP_POOLS = {
  easy:   ["add", "sub", "mulN", "divN"],
  medium: ["add", "sub", "mulN", "divN", "sq", "sqrt", "neg", "recip"],
  hard:   ["add", "sub", "mulN", "divN", "sq", "sqrt", "neg", "recip", "cu", "cbrt", "pow23", "pow32"],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Build a layer object. display(inner) renders the layer wrapping inner.
function makeLayer(type) {
  const n = (type === "add" || type === "sub")   ? randomInt(1, 9)
          : (type === "mulN" || type === "divN") ? randomInt(2, 6)
          : null;

  // For postfix ops (powers, div) skip wrapping parens when inner is bare 🎁
  const needsWrap = x => x !== "🎁";

  switch (type) {
    case "add":   return { type, display: x => `${x} + ${n}`,                                    inverse: `− ${n}` };
    case "sub":   return { type, display: x => `${x} − ${n}`,                                    inverse: `+ ${n}` };
    case "mulN":  return { type, display: x => `${n}(${x})`,                                     inverse: `÷ ${n}` };
    case "divN":  return { type, display: x => `${needsWrap(x) ? `(${x})` : x} ÷ ${n}`,         inverse: `× ${n}` };
    case "sq":    return { type, display: x => `${needsWrap(x) ? `(${x})` : x}²`,               inverse: `√` };
    case "cu":    return { type, display: x => `${needsWrap(x) ? `(${x})` : x}³`,               inverse: `∛` };
    case "sqrt":  return { type, display: x => `√(${x})`,                                        inverse: `^2` };
    case "cbrt":  return { type, display: x => `∛(${x})`,                                        inverse: `^3` };
    case "pow23": return { type, display: x => `${needsWrap(x) ? `(${x})` : x}^(2/3)`,          inverse: `^(3/2)` };
    case "pow32": return { type, display: x => `${needsWrap(x) ? `(${x})` : x}^(3/2)`,          inverse: `^(2/3)` };
    case "neg":   return { type, display: x => `−(${x})`,                                        inverse: `negate` };
    case "recip": return { type, display: x => `1/(${x})`,                                       inverse: `1/x` };
  }
}

// adjacentType = the layer this new one will sit directly beside (its inner or outer neighbour).
// Rules: no two consecutive additive layers (display ambiguity); no double neg or double recip.
function generateLayer(difficulty, adjacentType) {
  const addAdj = adjacentType === "add" || adjacentType === "sub";
  const pool = OP_POOLS[difficulty].filter(t => {
    if (addAdj && (t === "add" || t === "sub")) return false;
    if (adjacentType === "neg"   && t === "neg")   return false;
    if (adjacentType === "recip" && t === "recip") return false;
    return true;
  });
  return makeLayer(pool[Math.floor(Math.random() * pool.length)]);
}

// stack[0] = innermost layer (wraps 🎁), stack[N-1] = outermost (what player sees first).
function buildInitialStack(difficulty) {
  const depth = DEPTH[difficulty];
  const stack = [];
  for (let i = 0; i < depth; i++) {
    const adj = stack.length ? stack[stack.length - 1].type : null;
    stack.push(generateLayer(difficulty, adj));
  }
  return stack;
}

function buildExpressionString(stack) {
  let expr = "🎁";
  for (const layer of stack) expr = layer.display(expr);
  return expr;
}

// ---- game state ----

let currentDifficulty = "easy";
let stack = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;

// ---- calculator state ----

let calcOp = "";
let calcNum = "";

function startGame(difficulty) {
  currentDifficulty = difficulty;
  score = 0;
  isGameOver = false;
  stack = buildInitialStack(difficulty);
  resetCalc();
  renderGame();
}

function updateScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("algebraUnlockBest", bestScore);
  }
}

function renderGame() {
  resetCalc();
  document.getElementById("score").textContent = score;
  document.getElementById("best").textContent = bestScore;
  document.getElementById("equation").textContent = buildExpressionString(stack);
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("restart-btn").style.display = isGameOver ? "inline-block" : "none";
  document.getElementById("next-equation").textContent = "";
  document.getElementById("calc-keys").classList.toggle("disabled", isGameOver);
}

// ---- calculator ----

function resetCalc() {
  calcOp = "";
  calcNum = "";
  document.querySelectorAll(".calc-btn").forEach(b => b.classList.remove("active"));
  updateCalcDisplay();
}

function updateCalcDisplay() {
  const display = document.getElementById("calc-display");
  if (!calcOp) {
    display.textContent = "—";
    display.classList.add("placeholder");
    return;
  }
  display.classList.remove("placeholder");
  const label = OP_DISPLAY[calcOp] || calcOp;
  display.textContent = FUNCTION_OPS.has(calcOp) ? label : label + (calcNum ? " " + calcNum : "");
}

function handleCalcKey(type, value, buttonEl) {
  if (isGameOver) return;
  if (type === "fn" || type === "op") {
    calcOp = value;
    calcNum = "";
    document.querySelectorAll(".calc-btn").forEach(b => b.classList.remove("active"));
    if (buttonEl) buttonEl.classList.add("active");
  } else if (type === "num") {
    if (calcNum.length < 2) calcNum += value;
  }
  updateCalcDisplay();
}

function handleCalcBack() {
  if (isGameOver) return;
  if (calcNum.length > 0) {
    calcNum = calcNum.slice(0, -1);
  } else {
    calcOp = "";
    document.querySelectorAll(".calc-btn").forEach(b => b.classList.remove("active"));
  }
  updateCalcDisplay();
}

function handleCalcEnter() {
  if (isGameOver || !calcOp) return;
  const isFn = FUNCTION_OPS.has(calcOp);
  if (!isFn && !calcNum) return;
  const operation = isFn ? calcOp : calcOp + " " + calcNum;
  resetCalc();
  checkOperation(operation);
}

function checkOperation(operation) {
  if (isGameOver) return;
  const outermost = stack[stack.length - 1];

  if (operation === outermost.inverse) {
    score++;
    updateScore();
    document.getElementById("score").textContent = score;
    document.getElementById("best").textContent = bestScore;

    const feedback = document.getElementById("feedback");
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";

    // Show the briefly-exposed inner structure before the new deepest layer wraps it
    const exposed = buildExpressionString(stack.slice(0, -1));
    document.getElementById("next-equation").textContent = "→ " + exposed;

    const equationEl = document.getElementById("equation");
    equationEl.classList.add("solved");
    setTimeout(() => equationEl.classList.remove("solved"), 400);

    setTimeout(() => {
      stack.pop(); // remove outermost
      // New layer added at the bottom — 🎁 recedes one layer deeper
      const adj = stack[0] ? stack[0].type : null;
      stack.unshift(generateLayer(currentDifficulty, adj));
      renderGame();
    }, 700);

  } else {
    endGame(outermost.inverse);
  }
}

function endGame(correctOperation) {
  isGameOver = true;
  resetCalc();
  const feedback = document.getElementById("feedback");
  feedback.textContent = `Wrong. Correct move was: ${correctOperation}`;
  feedback.className = "feedback wrong";
  document.getElementById("restart-btn").style.display = "inline-block";
  document.getElementById("calc-keys").classList.add("disabled");
}

document.addEventListener("DOMContentLoaded", () => {
  bestScore = parseInt(localStorage.getItem("algebraUnlockBest") || "0", 10);

  document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      startGame(btn.dataset.difficulty);
    });
  });

  document.getElementById("calc-keys").addEventListener("click", e => {
    const btn = e.target.closest(".calc-btn[data-type]");
    if (!btn) return;
    handleCalcKey(btn.dataset.type, btn.dataset.value, btn);
  });

  document.getElementById("calc-back").addEventListener("click", handleCalcBack);
  document.getElementById("calc-enter").addEventListener("click", handleCalcEnter);

  document.addEventListener("keydown", e => {
    if (isGameOver) return;
    if (e.key >= "0" && e.key <= "9") {
      handleCalcKey("num", e.key, null);
    } else if (e.key === "+") {
      handleCalcKey("op", "+", document.querySelector('[data-value="+"]'));
    } else if (e.key === "-") {
      handleCalcKey("op", "−", document.querySelector('[data-value="−"]'));
    } else if (e.key === "*") {
      handleCalcKey("op", "×", document.querySelector('[data-value="×"]'));
    } else if (e.key === "/" || e.key === "÷") {
      e.preventDefault();
      handleCalcKey("op", "÷", document.querySelector('[data-value="÷"]'));
    } else if (e.key === "Backspace") {
      handleCalcBack();
    } else if (e.key === "Enter") {
      handleCalcEnter();
    }
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    startGame(currentDifficulty);
  });

  startGame("easy");
  document.querySelector('.diff-btn[data-difficulty="easy"]').classList.add("active");
});
