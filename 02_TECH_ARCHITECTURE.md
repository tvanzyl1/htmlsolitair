# 02 — Tech Architecture Agent

## Mission

Design the technical architecture for a self-contained browser-based solitaire game.

## Tech direction

Use:
- `index.html`
- `styles.css`
- `script.js`

Optional split if needed:
- `js/state.js`
- `js/rules.js`
- `js/render.js`
- `js/input.js`
- `js/audio.js`

Keep it lightweight. No build step unless absolutely necessary.

## Core systems to define

### 1. Card model
Each card should track:
- suit
- rank
- colour
- face-up / face-down state
- unique id

### 2. Pile model
Represent:
- stock
- waste
- foundation piles x4
- tableau piles x7

Each pile should have:
- pile type
- array of card ids or card objects
- layout metadata for rendering

### 3. Game state
Include:
- shuffled deck
- all piles
- selected card stack if any
- drag state if any
- move history for future undo support
- timer state if timer is enabled
- win detection flag
- interaction lock during animations

### 4. Rule engine
Encapsulate:
- legal move checking
- stock draw behaviour
- waste recycle behaviour
- foundation move rules
- tableau move rules
- auto-flip of newly exposed tableau cards
- win detection

### 5. Renderer
Responsible for:
- drawing / updating piles
- card positions
- card face visuals
- highlights
- animations
- responsive scaling

### 6. Input controller
Responsible for:
- mouse events
- touch events
- drag lifecycle
- click/tap shortcuts
- accessibility-minded hit areas

## Architectural priorities

1. correctness of rules
2. predictable state updates
3. clear separation between rules and rendering
4. easy future support for undo/hints/settings
5. smooth mobile interaction

## Data flow recommendation

Use a state-driven approach:

1. user input occurs
2. input layer interprets intent
3. rules layer validates move
4. state updates
5. renderer updates UI
6. feedback / animation plays
7. win condition is checked

## Rendering recommendations

Prefer DOM-based card rendering rather than canvas for this concept because:
- cards are discrete interactive objects
- drag-and-drop is easier to manage
- responsive layout is easier
- accessibility improvements are more achievable later

Use CSS transforms for smooth movement where practical.

## Responsive design notes

Need layouts for:
- desktop wide view
- tablet medium view
- phone narrow portrait view

Requirements:
- cards remain readable
- touch targets remain large enough
- drag should not require pixel-perfect precision
- stock, waste, foundations, and tableau should remain clearly separated

## Deliverables for this phase

Produce:
- proposed file structure
- key objects and functions
- state schema
- event flow summary
- list of extension hooks for future features such as undo, hints, daily challenge, alternate card backs, left-handed mode, and score tracking
