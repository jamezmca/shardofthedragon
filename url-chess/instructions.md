Build a complete browser-based chess web app with NO backend and NO server state (single HTML doc). It must work as a static site only. The core multiplayer mechanic is that the entire game state is shareable via the URL, and players manually send the updated URL to each other after each move. Bare minimum styling, just a black and white board, and inputs for moves, and any other essentials and nothing more.

I want you to produce the full code for the app, with a clean structure, modern plain JavaScript or Next.js/React if you think that is clearly better, but keep it lightweight. Prioritize correctness, clarity, and usability over overengineering.

==================================================
PRODUCT GOAL
==================================================

Create a 2-player chess game that runs entirely in the browser and supports multiple concurrent games with no backend. The game state should be encoded in the URL so that the updated URL can be sent to the other player after every move.

The app should:
- support proper chess movement rules
- support move legality checks
- support castling
- support en passant
- support pawn promotion
- support check / illegal self-check prevention if reasonably achievable
- support multiple concurrent games
- allow players to manually share the URL after each move
- detect when the current URL is older than a locally known newer version of the same game
- warn the user if the current link is stale / dated
- allow URL recompression by replacing long move history with a compact board snapshot when needed
- show a rough “moves left before URL gets too long” estimate

I do NOT care about strong security or anti-cheat. Assume good-faith players. Forked histories are acceptable. If a fork happens, just make it understandable.

==================================================
TECH REQUIREMENTS
==================================================

Build this as a static/serverless web app:
- no backend
- no database
- no websocket
- no auth
- no server actions required
- no external game state persistence

Use:
- plain JavaScript, HTML, and CSS if possible
OR
- React if you strongly think it makes the UI/state logic cleaner

Avoid unnecessary libraries.
If you use a chess rules library, only do so if it clearly improves correctness and still keeps the project simple and transparent. If you use one, explain why. If you do NOT use one, implement the rules carefully yourself.

I want the final result to be easy to run locally and easy to deploy as a static site.

==================================================
CORE URL / STATE DESIGN
==================================================

The source of truth must be the URL, not localStorage.

Support multiple concurrent games by including a game ID in the URL.

Use a URL format conceptually like:
- ?g=<gameId>&s=<state>

Where:
- g = game id
- s = encoded game state

The app must support two state representations:

1. MOVE-HISTORY MODE
The state is stored as a compact move list from the standard initial chess position.

2. SNAPSHOT MODE
When the move-history representation gets too long, allow the app to replace it with a compact current board snapshot plus side to move and any extra state needed. This “recompresses” the URL so the game can continue.

The app should be able to load either representation automatically.

I want the code to be designed so that:
- move-history mode is preferred initially
- snapshot mode is used when needed or when the user clicks a “compress URL” button
- the app can restore the board correctly from either representation

==================================================
CHESS LOGIC REQUIREMENTS
==================================================

Implement proper chess behavior as well as reasonably possible.

Must support:
- standard starting board
- turn order
- legal movement by piece type
- captures
- path blocking
- check whether the moving side is trying to move opponent pieces
- illegal move rejection
- self-check prevention if reasonably achievable
- check indication if reasonably achievable
- castling rules
- en passant rules
- pawn promotion

For pawn promotion:
- when a pawn reaches the last rank, prompt for promotion piece
- support at least queen, rook, bishop, knight
- encode promotion in URL state correctly

The user described “reviving players if pawns reach the end etc.” Interpret that as normal chess pawn promotion, not any custom rule.

If full checkmate / stalemate detection is practical, include it.
If not, at minimum include:
- legal move validation
- self-check prevention
- check warning if king is under attack

==================================================
MOVE INPUT UX
==================================================

Moves are entered through a text input, not by dragging pieces.

Primary move format:
- e2-e4

Requirements:
- accept lowercase and uppercase input
- normalize spacing
- validate format
- once the “from square” and dash exist, the app may begin checking whether a piece exists there and whether it belongs to the side to move
- once a full move is entered, validate legality

Useful UX additions:
- show validation feedback below the input
- tell the user exactly why a move is invalid
- optionally highlight the from-square and legal destinations after parsing the origin
- support castle input via king move notation like:
  - e1-g1
  - e1-c1
  - e8-g8
  - e8-c8
- promotion may use something like:
  - e7-e8=q
  or a promotion picker after entering the move

Choose a clean and intuitive final UX, but keep the primary input style as square-to-square with a dash.

==================================================
LOCALSTORAGE REQUIREMENTS
==================================================

Use localStorage only for browser-local convenience state, not as the source of truth.

Store per-game local info such as:
- which side this browser is playing as
- latest locally seen version / revision / hash for that game
- maybe a timestamp of the last locally opened state

Use localStorage keys scoped by game ID, such as:
- chess:<gameId>:side
- chess:<gameId>:latestStateHash
- chess:<gameId>:latestMoveCount
- chess:<gameId>:lastSeenAt

This browser-local state should help with:
- knowing whether it is “your turn”
- warning if the current opened link is older than a newer version previously seen on this device
- keeping multiple concurrent games separate

==================================================
STALE / DATED VERSION DETECTION
==================================================

This is important.

The app should warn users if the currently opened URL for a game appears to be older than a newer version already seen locally for the same game.

Examples:
- if the current URL has fewer moves than the locally remembered latest version, warn that this link appears stale
- if the current state hashes differently from the local newest known state for the same game, make that understandable
- if there are forks, do not break; just explain that the game may have diverged

I want pragmatic good-faith handling, not perfect distributed consistency.

Suggested UX:
- “This link appears older than the newest version of this game seen on this browser.”
- “You may be viewing a stale or forked branch of the game.”

==================================================
TURN / PLAYER UX
==================================================

The app should make turns obvious.

Rules:
- each browser can choose or store whether it is playing White or Black for that game
- the UI should clearly show:
  - side to move
  - your side
  - whether it is your turn
- because the app is manual-link-sharing, it should also give obvious next actions:
  - “Make your move”
  - “Copy updated link and send it to your opponent”
  - “Waiting for opponent’s updated link”

Provide:
- button to choose “Play as White”
- button to choose “Play as Black”
- persist this choice in localStorage per game

For a new game, it would be nice if:
- creator can start a new game
- creator gets a fresh game ID
- side defaults to white unless changed manually

==================================================
URL LENGTH / CAPACITY UX
==================================================

Include a rough capacity indicator for the URL.

I want a pragmatic estimate, not browser-perfect precision.

Show something like:
- current URL length
- approximate safe max budget
- estimated moves remaining before compression is recommended

Also include a button like:
- “Compress URL”
which converts the current game into snapshot mode using a compact board-state representation.

Important:
- snapshot mode must preserve enough info for continued legal play, including:
  - board layout
  - side to move
  - castling rights
  - en passant target if needed
  - maybe halfmove/fullmove counts if useful
- once compressed, the game should continue normally

If useful, FEN-inspired encoding is acceptable for snapshot mode, but keep the URL reasonably compact.

==================================================
MULTIPLE CONCURRENT GAMES
==================================================

This is required.

Support many separate games at once by scoping everything using the game ID.

That means:
- game A and game B can both be opened on the same browser
- local side selection must not clash
- stale detection must be per game
- local latest-known version must be per game

==================================================
UI REQUIREMENTS
==================================================

I want a clean, simple UI. Functional and pleasant, not flashy.

Include:
- rendered chessboard
- text move input
- move history display
- current turn display
- your side display
- stale/fork warning area
- buttons:
  - new game
  - copy shareable link
  - compress URL
  - play as white
  - play as black
- maybe a reset local cache / clear local data for this game button

A “New Game” button should:
- generate a fresh game ID
- reset to initial state
- clear or reinitialize local cache for that new game
- produce a clean sharable URL

Also include:
- move status / validation message area
- indication if in check, checkmate, stalemate, or just “game over” if implemented

==================================================
DATA ENCODING EXPECTATIONS
==================================================

Please choose sensible compact encodings.

Suggested approach:
- move-history mode: compact move encoding
- snapshot mode: compact board-state encoding, maybe FEN-like but made URL-safe

Try to keep URL encoding:
- readable enough to debug
- but still compact enough for many moves

Be careful with URL-safe characters.
Use robust encoding/decoding helpers.

==================================================
IMPLEMENTATION EXPECTATIONS
==================================================

Please produce:
1. the full codebase
2. a short explanation of architecture
3. explanation of how URL state encoding works
4. explanation of stale-link detection
5. explanation of compression / snapshot logic
6. instructions to run locally
7. instructions to deploy as a static site

Also:
- keep code organized and readable
- include comments in complex logic
- avoid giant monolithic files if possible
- do not leave placeholder pseudocode
- do not omit the hard parts

==================================================
IMPORTANT EDGE CASES
==================================================

Handle these properly:
- invalid square input
- moving from an empty square
- moving opponent’s piece
- moving when it is not your turn
- attempting illegal castle
- promotion flow
- en passant timing
- opening an old game URL
- opening a game that has diverged from locally known state
- compressing URL mid-game
- loading a compressed game and continuing play normally
- switching local side between white and black
- clearing local cache for one game without breaking others

==================================================
DELIVERABLE STYLE
==================================================

Give me the finished implementation, not just a plan.

If you need to make design decisions, choose the most practical option and proceed.

If there is a tradeoff between:
- total chess correctness
and
- keeping the app understandable and maintainable,

favor a solid, practical implementation with as much real chess legality as is reasonable.

At the end, also provide:
- a brief list of known limitations
- a brief list of future improvements