# Algebra Unlock

A browser-based algebra game where players solve equations one layer at a time by choosing the correct inverse operation.

## How to run

Open `index.html` in any modern browser. No build step or server required.

## How to play

An equation is shown on screen. Your job is to identify the **outermost** operation wrapping `x` and choose its inverse from the four buttons. Each correct pick peels one layer off the equation until `x` is isolated. One wrong answer ends the game.

Three difficulty levels:

- **Easy** — 1–2 layers, basic operations only
- **Medium** — 2–3 layers, brackets and multiple steps
- **Hard** — 3–4 layers, nested brackets

Your best score is saved in `localStorage` between sessions.

## How to add puzzles

Open `script.js` and add a new object to the `puzzles.easy`, `puzzles.medium`, or `puzzles.hard` array.

Each puzzle has a `layers` array. Each layer needs:

```js
{
  equation: "3(x + 4) = 27",      // shown to the player
  correctOperation: "÷ 3",         // the right answer
  options: ["÷ 3", "× 3", "+ 3", "− 3"],  // all four buttons (shuffled at runtime)
  nextEquation: "x + 4 = 9"       // shown briefly after a correct pick
}
```

The last layer's `nextEquation` should be the solved form `x = <value>`. When the final layer is completed the game automatically loads a new random puzzle.

## Puzzle data structure

```js
const puzzles = {
  easy: [
    {
      layers: [
        { equation, correctOperation, options, nextEquation },
        // ... more layers
      ]
    },
    // ... more puzzles
  ],
  medium: [ ... ],
  hard: [ ... ]
}
```

Keep arithmetic clean — avoid decimals. Prefer equations where the outermost operation is unambiguous so players learn to work from the outside in.
