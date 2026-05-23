// Function ops need no digit — pressing one sets the full operation.
// Arithmetic ops need a digit after: + − × ÷ followed by a number.
const FUNCTION_OPS = new Set(["√", "∛", "^2", "^3", "^(2/3)", "^(3/2)", "negate", "1/x"]);

// How each operation string displays in the calc screen
const OP_DISPLAY = {
  "^2":     "x²",
  "^3":     "x³",
  "^(2/3)": "x^(2/3)",
  "^(3/2)": "x^(3/2)",
  "negate": "−x",
  "1/x":    "1/x",
};

const puzzles = {
  // Easy: 2 layers, arithmetic only
  easy: [
    {
      layers: [
        { equation: "3(🎁 + 4)",      correctOperation: "÷ 3", nextEquation: "🎁 + 4" },
        { equation: "🎁 + 4",          correctOperation: "− 4", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "2(🎁 − 5)",      correctOperation: "÷ 2", nextEquation: "🎁 − 5" },
        { equation: "🎁 − 5",          correctOperation: "+ 5", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "(🎁 + 6) × 4",   correctOperation: "÷ 4", nextEquation: "🎁 + 6" },
        { equation: "🎁 + 6",          correctOperation: "− 6", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "5(🎁 + 3)",       correctOperation: "÷ 5", nextEquation: "🎁 + 3" },
        { equation: "🎁 + 3",          correctOperation: "− 3", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "(🎁 − 2) × 3",   correctOperation: "÷ 3", nextEquation: "🎁 − 2" },
        { equation: "🎁 − 2",          correctOperation: "+ 2", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "4(🎁 + 7)",       correctOperation: "÷ 4", nextEquation: "🎁 + 7" },
        { equation: "🎁 + 7",          correctOperation: "− 7", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "(🎁 + 8) ÷ 2",   correctOperation: "× 2", nextEquation: "🎁 + 8" },
        { equation: "🎁 + 8",          correctOperation: "− 8", nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "6(🎁 − 3)",       correctOperation: "÷ 6", nextEquation: "🎁 − 3" },
        { equation: "🎁 − 3",          correctOperation: "+ 3", nextEquation: "🎁" }
      ]
    }
  ],

  // Medium: 3 layers — √/^2, negation, reciprocal
  medium: [
    {
      layers: [
        { equation: "3(🎁 + 2)²",        correctOperation: "÷ 3",    nextEquation: "(🎁 + 2)²" },
        { equation: "(🎁 + 2)²",         correctOperation: "√",      nextEquation: "🎁 + 2" },
        { equation: "🎁 + 2",            correctOperation: "− 2",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "(🎁 + 5)² − 9",     correctOperation: "+ 9",    nextEquation: "(🎁 + 5)²" },
        { equation: "(🎁 + 5)²",         correctOperation: "√",      nextEquation: "🎁 + 5" },
        { equation: "🎁 + 5",            correctOperation: "− 5",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "√(🎁 − 4) + 3",     correctOperation: "− 3",    nextEquation: "√(🎁 − 4)" },
        { equation: "√(🎁 − 4)",         correctOperation: "^2",     nextEquation: "🎁 − 4" },
        { equation: "🎁 − 4",            correctOperation: "+ 4",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "2(🎁 + 7)²",        correctOperation: "÷ 2",    nextEquation: "(🎁 + 7)²" },
        { equation: "(🎁 + 7)²",         correctOperation: "√",      nextEquation: "🎁 + 7" },
        { equation: "🎁 + 7",            correctOperation: "− 7",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "−(🎁 + 4) + 7",     correctOperation: "− 7",    nextEquation: "−(🎁 + 4)" },
        { equation: "−(🎁 + 4)",         correctOperation: "negate", nextEquation: "🎁 + 4" },
        { equation: "🎁 + 4",            correctOperation: "− 4",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "−(3(🎁 + 5))",      correctOperation: "negate", nextEquation: "3(🎁 + 5)" },
        { equation: "3(🎁 + 5)",         correctOperation: "÷ 3",    nextEquation: "🎁 + 5" },
        { equation: "🎁 + 5",            correctOperation: "− 5",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "3/(🎁 + 5)",        correctOperation: "÷ 3",    nextEquation: "1/(🎁 + 5)" },
        { equation: "1/(🎁 + 5)",        correctOperation: "1/x",    nextEquation: "🎁 + 5" },
        { equation: "🎁 + 5",            correctOperation: "− 5",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "1/(🎁 − 3) + 4",    correctOperation: "− 4",    nextEquation: "1/(🎁 − 3)" },
        { equation: "1/(🎁 − 3)",        correctOperation: "1/x",    nextEquation: "🎁 − 3" },
        { equation: "🎁 − 3",            correctOperation: "+ 3",    nextEquation: "🎁" }
      ]
    }
  ],

  // Hard: 4 layers — ^3, ∛, fractional exponents, negation, reciprocal
  hard: [
    {
      layers: [
        { equation: "2((🎁 + 1)³ − 4)",        correctOperation: "÷ 2",    nextEquation: "(🎁 + 1)³ − 4" },
        { equation: "(🎁 + 1)³ − 4",           correctOperation: "+ 4",    nextEquation: "(🎁 + 1)³" },
        { equation: "(🎁 + 1)³",               correctOperation: "∛",      nextEquation: "🎁 + 1" },
        { equation: "🎁 + 1",                  correctOperation: "− 1",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "3∛(🎁 + 2) + 5",          correctOperation: "− 5",    nextEquation: "3∛(🎁 + 2)" },
        { equation: "3∛(🎁 + 2)",              correctOperation: "÷ 3",    nextEquation: "∛(🎁 + 2)" },
        { equation: "∛(🎁 + 2)",               correctOperation: "^3",     nextEquation: "🎁 + 2" },
        { equation: "🎁 + 2",                  correctOperation: "− 2",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "4(🎁 − 3)^(2/3) + 12",   correctOperation: "− 12",   nextEquation: "4(🎁 − 3)^(2/3)" },
        { equation: "4(🎁 − 3)^(2/3)",         correctOperation: "÷ 4",    nextEquation: "(🎁 − 3)^(2/3)" },
        { equation: "(🎁 − 3)^(2/3)",          correctOperation: "^(3/2)", nextEquation: "🎁 − 3" },
        { equation: "🎁 − 3",                  correctOperation: "+ 3",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "2(🎁 + 4)^(3/2) − 16",   correctOperation: "+ 16",   nextEquation: "2(🎁 + 4)^(3/2)" },
        { equation: "2(🎁 + 4)^(3/2)",         correctOperation: "÷ 2",    nextEquation: "(🎁 + 4)^(3/2)" },
        { equation: "(🎁 + 4)^(3/2)",          correctOperation: "^(2/3)", nextEquation: "🎁 + 4" },
        { equation: "🎁 + 4",                  correctOperation: "− 4",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "−(3(🎁 + 2)²)",           correctOperation: "negate", nextEquation: "3(🎁 + 2)²" },
        { equation: "3(🎁 + 2)²",              correctOperation: "÷ 3",    nextEquation: "(🎁 + 2)²" },
        { equation: "(🎁 + 2)²",               correctOperation: "√",      nextEquation: "🎁 + 2" },
        { equation: "🎁 + 2",                  correctOperation: "− 2",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "−(2(🎁 − 5)^(2/3))",     correctOperation: "negate", nextEquation: "2(🎁 − 5)^(2/3)" },
        { equation: "2(🎁 − 5)^(2/3)",         correctOperation: "÷ 2",    nextEquation: "(🎁 − 5)^(2/3)" },
        { equation: "(🎁 − 5)^(2/3)",          correctOperation: "^(3/2)", nextEquation: "🎁 − 5" },
        { equation: "🎁 − 5",                  correctOperation: "+ 5",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "2/(🎁 + 4)²",             correctOperation: "÷ 2",    nextEquation: "1/(🎁 + 4)²" },
        { equation: "1/(🎁 + 4)²",             correctOperation: "1/x",    nextEquation: "(🎁 + 4)²" },
        { equation: "(🎁 + 4)²",               correctOperation: "√",      nextEquation: "🎁 + 4" },
        { equation: "🎁 + 4",                  correctOperation: "− 4",    nextEquation: "🎁" }
      ]
    },
    {
      layers: [
        { equation: "1/(🎁 + 1)³ + 4",         correctOperation: "− 4",    nextEquation: "1/(🎁 + 1)³" },
        { equation: "1/(🎁 + 1)³",             correctOperation: "1/x",    nextEquation: "(🎁 + 1)³" },
        { equation: "(🎁 + 1)³",               correctOperation: "∛",      nextEquation: "🎁 + 1" },
        { equation: "🎁 + 1",                  correctOperation: "− 1",    nextEquation: "🎁" }
      ]
    }
  ]
};

let currentDifficulty = "easy";
let currentPuzzle = null;
let currentLayerIndex = 0;
let score = 0;
let bestScore = 0;
let isGameOver = false;

// Calculator state
let calcOp = "";
let calcNum = "";

function startGame(difficulty) {
  currentDifficulty = difficulty;
  score = 0;
  isGameOver = false;
  loadNewPuzzle();
  resetCalc();
  renderGame();
}

function loadNewPuzzle() {
  const pool = puzzles[currentDifficulty];
  currentPuzzle = pool[Math.floor(Math.random() * pool.length)];
  currentLayerIndex = 0;
}

function updateScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("algebraUnlockBest", bestScore);
  }
}

function renderGame() {
  document.getElementById("score").textContent = score;
  document.getElementById("best").textContent = bestScore;

  const layer = currentPuzzle.layers[currentLayerIndex];
  document.getElementById("equation").textContent = layer.equation;

  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("restart-btn").style.display = isGameOver ? "inline-block" : "none";
  document.getElementById("next-equation").textContent = "";
  document.getElementById("calc-keys").classList.toggle("disabled", isGameOver);
}

// --- Calculator ---

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
  const opLabel = OP_DISPLAY[calcOp] || calcOp;
  if (FUNCTION_OPS.has(calcOp)) {
    display.textContent = opLabel;
  } else {
    display.textContent = opLabel + (calcNum ? " " + calcNum : "");
  }
}

function handleCalcKey(type, value, buttonEl) {
  if (isGameOver) return;

  if (type === "fn") {
    calcOp = value;
    calcNum = "";
    document.querySelectorAll(".calc-btn").forEach(b => b.classList.remove("active"));
    if (buttonEl) buttonEl.classList.add("active");
  } else if (type === "op") {
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
  const layer = currentPuzzle.layers[currentLayerIndex];

  if (operation === layer.correctOperation) {
    score++;
    updateScore();
    document.getElementById("score").textContent = score;
    document.getElementById("best").textContent = bestScore;

    const feedback = document.getElementById("feedback");
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";

    document.getElementById("next-equation").textContent = "→ " + layer.nextEquation;

    const equationEl = document.getElementById("equation");
    equationEl.classList.add("solved");
    setTimeout(() => equationEl.classList.remove("solved"), 400);

    const isLastLayer = currentLayerIndex >= currentPuzzle.layers.length - 1;
    setTimeout(() => {
      if (isLastLayer) loadNewPuzzle();
      else currentLayerIndex++;
      renderGame();
    }, 700);
  } else {
    endGame(layer.correctOperation);
  }
}

function endGame(correctOperation) {
  isGameOver = true;
  const feedback = document.getElementById("feedback");
  feedback.textContent = `Wrong. Correct move was: ${correctOperation}`;
  feedback.className = "feedback wrong";
  document.getElementById("restart-btn").style.display = "inline-block";
  document.getElementById("calc-keys").classList.add("disabled");
}

document.addEventListener("DOMContentLoaded", () => {
  bestScore = parseInt(localStorage.getItem("algebraUnlockBest") || "0", 10);

  // Difficulty buttons
  document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      startGame(btn.dataset.difficulty);
    });
  });

  // Calculator keypad — event delegation
  document.getElementById("calc-keys").addEventListener("click", e => {
    const btn = e.target.closest(".calc-btn[data-type]");
    if (!btn) return;
    handleCalcKey(btn.dataset.type, btn.dataset.value, btn);
  });

  document.getElementById("calc-back").addEventListener("click", handleCalcBack);
  document.getElementById("calc-enter").addEventListener("click", handleCalcEnter);

  // Keyboard shortcuts for arithmetic ops and digits
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
