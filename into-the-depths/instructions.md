````md
# Algebra Unlock Game — Build Instructions

Build a simple browser-based algebra game using plain HTML, CSS, and JavaScript.

No frameworks. No build step. No backend.

The app should run by opening `index.html` in the browser.

---

# Core Concept

The player is trying to make the innermost variable the subject.

An equation is shown with layers wrapped around `x`.

The player must choose the correct inverse operation to remove the outermost layer.

Each correct answer removes one layer and reveals the next simpler equation.

The goal is to solve as many layers as possible before making a mistake.

Example:

```txt
3(x + 4) = 27
````

Correct move:

```txt
÷ 3
```

Then the equation becomes:

```txt
x + 4 = 9
```

Correct move:

```txt
− 4
```

Then:

```txt
x = 5
```

Solved.

---

# Files

Create these files:

```txt
index.html
style.css
script.js
README.md
```

---

# App Layout

The page should have:

1. A title:

   ```txt
   Algebra Unlock
   ```

2. A short instruction:

   ```txt
   Choose the inverse operation that unlocks the next layer.
   ```

3. Difficulty buttons:

   ```txt
   Easy | Medium | Hard
   ```

4. A score area:

   ```txt
   Score: 0
   Best: 0
   ```

5. The current equation displayed large in the center.

6. Operation buttons underneath the equation.

7. A feedback message:

   ```txt
   Correct!
   ```

   or

   ```txt
   Wrong move. Game over.
   ```

8. A restart button after game over.

---

# Visual Style

Keep styling simple.

Use basic clean HTML/CSS.

Requirements:

* Center the main game container.
* Use a max width around `700px`.
* Use a plain light background.
* Use dark text.
* Equation should be large and readable.
* Buttons should be large enough for classroom/tablet use.
* Use simple borders, padding, and hover states.
* No fancy animations required.
* Optional: add a small “zoom” effect when a layer is solved.

Do not over-design it.

---

# Game Mechanics

The game uses a list of prebuilt puzzle objects.

Each puzzle contains a sequence of layers.

Each layer has:

```js
{
  equation: "3(x + 4) = 27",
  correctOperation: "÷ 3",
  nextEquation: "x + 4 = 9"
}
```

When the player clicks an operation:

* If it matches `correctOperation`:

  * Increase score by 1.
  * Move to the next layer.
  * Show positive feedback.
* If it is wrong:

  * End the game.
  * Show the correct operation.
  * Show restart button.

When all layers in a puzzle are solved:

* Increase score.
* Load a new puzzle of the selected difficulty.

---

# Difficulty Levels

Create 3 difficulty levels.

## Easy

Easy puzzles should use 1–2 layers.

Only use:

* addition
* subtraction
* multiplication
* division

Examples:

```txt
x + 5 = 12
x - 3 = 9
2x = 14
x ÷ 4 = 3
3(x + 2) = 15
```

## Medium

Medium puzzles should use 2–3 layers.

Use brackets and multiple inverse operations.

Examples:

```txt
2(x + 5) = 18
(x - 3) ÷ 4 = 5
3(x - 2) + 4 = 19
5(x + 1) - 7 = 13
```

## Hard

Hard puzzles should use 3–4 layers.

Use nested brackets, negatives, and fractions written simply.

Examples:

```txt
2(3(x - 1) + 4) = 20
(4(x + 2) - 6) ÷ 2 = 9
5(2(x - 3) + 1) - 4 = 31
```

Keep the arithmetic clean. Avoid ugly decimals.

---

# Operation Buttons

For each layer, show the correct operation plus 3 wrong operations.

Example for:

```txt
3(x + 4) = 27
```

Buttons could be:

```txt
÷ 3
− 3
× 3
+ 3
```

Shuffle the buttons each round.

The player should click one.

Do not use text input.

---

# Data Structure

Use this structure in `script.js`:

```js
const puzzles = {
  easy: [
    {
      layers: [
        {
          equation: "x + 5 = 12",
          correctOperation: "− 5",
          options: ["− 5", "+ 5", "÷ 5", "× 5"],
          nextEquation: "x = 7"
        }
      ]
    }
  ],
  medium: [],
  hard: []
}
```

Add at least:

* 8 easy puzzles
* 8 medium puzzles
* 8 hard puzzles

---

# State

Use simple state variables:

```js
let currentDifficulty = "easy"
let currentPuzzle = null
let currentLayerIndex = 0
let score = 0
let bestScore = 0
let isGameOver = false
```

Store `bestScore` in `localStorage`.

---

# Required Functions

Implement these functions:

```js
startGame(difficulty)
loadNewPuzzle()
renderGame()
handleOperationClick(operation)
endGame(correctOperation)
shuffleArray(array)
updateScore()
```

---

# Behaviour Details

## startGame(difficulty)

* Set the selected difficulty.
* Reset score to 0.
* Reset game over state.
* Load a new puzzle.
* Render the game.

## loadNewPuzzle()

* Pick a random puzzle from the current difficulty.
* Set `currentLayerIndex` to 0.

## renderGame()

Update the DOM with:

* current score
* best score
* current equation
* operation buttons
* feedback message
* restart button visibility

If game is over, disable operation buttons.

## handleOperationClick(operation)

* Get the current layer.
* Compare clicked operation to `correctOperation`.

If correct:

* Increment score.
* Update best score if needed.
* Show “Correct!”
* If there is another layer:

  * Increase `currentLayerIndex`.
  * Render the next equation.
* If the puzzle is complete:

  * Load a new puzzle.
  * Render it.

If incorrect:

* Call `endGame(correctOperation)`.

## endGame(correctOperation)

* Set `isGameOver` to true.
* Show:

  ```txt
  Wrong move. Game over. Correct move was [operation].
  ```
* Show restart button.

---

# Educational Rules

The game should reinforce:

* inverse operations
* solving equations from the outside inward
* maintaining balance
* identifying the outermost operation first

Avoid puzzles where the correct first move is ambiguous.

For example, this is okay:

```txt
3(x + 4) = 27
```

Correct first move:

```txt
÷ 3
```

This is less ideal:

```txt
3x + 12 = 27
```

because students may need to think about whether to subtract 12 or factor first.

Prefer clearly layered equations.

---

# Example Puzzles

Include these in the puzzle bank.

## Easy

```js
{
  layers: [
    {
      equation: "x + 5 = 12",
      correctOperation: "− 5",
      options: ["− 5", "+ 5", "× 5", "÷ 5"],
      nextEquation: "x = 7"
    }
  ]
}
```

```js
{
  layers: [
    {
      equation: "4x = 28",
      correctOperation: "÷ 4",
      options: ["÷ 4", "× 4", "+ 4", "− 4"],
      nextEquation: "x = 7"
    }
  ]
}
```

```js
{
  layers: [
    {
      equation: "2(x + 3) = 16",
      correctOperation: "÷ 2",
      options: ["÷ 2", "× 2", "+ 2", "− 2"],
      nextEquation: "x + 3 = 8"
    },
    {
      equation: "x + 3 = 8",
      correctOperation: "− 3",
      options: ["− 3", "+ 3", "× 3", "÷ 3"],
      nextEquation: "x = 5"
    }
  ]
}
```

## Medium

```js
{
  layers: [
    {
      equation: "3(x − 2) + 4 = 19",
      correctOperation: "− 4",
      options: ["− 4", "+ 4", "÷ 3", "× 3"],
      nextEquation: "3(x − 2) = 15"
    },
    {
      equation: "3(x − 2) = 15",
      correctOperation: "÷ 3",
      options: ["÷ 3", "× 3", "+ 3", "− 3"],
      nextEquation: "x − 2 = 5"
    },
    {
      equation: "x − 2 = 5",
      correctOperation: "+ 2",
      options: ["+ 2", "− 2", "× 2", "÷ 2"],
      nextEquation: "x = 7"
    }
  ]
}
```

## Hard

```js
{
  layers: [
    {
      equation: "2(3(x − 1) + 4) = 20",
      correctOperation: "÷ 2",
      options: ["÷ 2", "× 2", "− 2", "+ 2"],
      nextEquation: "3(x − 1) + 4 = 10"
    },
    {
      equation: "3(x − 1) + 4 = 10",
      correctOperation: "− 4",
      options: ["− 4", "+ 4", "÷ 4", "× 4"],
      nextEquation: "3(x − 1) = 6"
    },
    {
      equation: "3(x − 1) = 6",
      correctOperation: "÷ 3",
      options: ["÷ 3", "× 3", "+ 3", "− 3"],
      nextEquation: "x − 1 = 2"
    },
    {
      equation: "x − 1 = 2",
      correctOperation: "+ 1",
      options: ["+ 1", "− 1", "× 1", "÷ 1"],
      nextEquation: "x = 3"
    }
  ]
}
```

---

# Nice-To-Have Features

Add these only if the core app is finished:

1. Streak display.
2. Timer mode.
3. Small transition when the equation changes.
4. Highlight the part of the equation being removed.
5. Sound toggle using simple browser audio.
6. Keyboard shortcuts for operation buttons.

Do not add these before the basic game works.

---

# README

Create a simple `README.md` explaining:

* what the game is
* how to run it
* how to add new puzzles
* how the puzzle data structure works

---

# Final Requirement

The finished app should be simple, readable, and easy to modify.

Prioritise clear code over clever code.

```
```
