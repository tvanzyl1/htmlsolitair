# Velvet Solitaire

Velvet Solitaire is a polished browser-based single-draw Klondike Solitaire game built with plain HTML, CSS, and JavaScript for static hosting.

## Features

- mouse and touch-friendly play
- drag-and-drop card movement
- tap and click smart moves
- double-click quick-send to foundations when safe
- stock draw with waste recycling
- move counter and timer
- start and win overlays
- responsive layout for desktop, tablet, and phone

## Controls

### Desktop

- Click the stock pile to draw one card.
- Drag cards or valid tableau runs to a legal destination.
- Click a face-up card to select it, then click a highlighted pile to move it.
- Double-click a card to send it to a foundation when safe and legal.
- Press `Esc` to clear the current selection.
- Press `N` to start a new game.

### Mobile and Tablet

- Tap the stock pile to draw one card.
- Drag cards with your finger.
- Tap a movable card for a smart move or to select it.
- Tap a highlighted destination pile to complete the move.

## Rules Summary

- standard 52-card deck
- 7 tableau columns
- 4 foundations
- 1 stock and 1 waste pile
- single-draw stock behavior
- tableau builds down by alternating color
- foundations build up by suit from Ace to King
- only Kings can move to an empty tableau column
- newly exposed tableau cards flip face-up automatically
- waste recycles back to stock when stock is empty

## Run Locally

No build step is required.

1. Open [index.html](/c:/Source/htmlsolitair/index.html) directly in a browser, or
2. Serve the folder with a simple static server.

Example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In repository settings, enable GitHub Pages.
3. Choose the branch that contains `index.html`.
4. Save settings and open the published site URL.

The app uses only relative local assets, so it is suitable for static hosting.

## Extension Ideas

- undo using the recorded move history
- hints from the rule engine
- score modes and vegas rules
- settings panel for sound and rule toggles
- daily challenge deals
- alternate table themes and card backs
- auto-complete once all hidden cards are revealed
