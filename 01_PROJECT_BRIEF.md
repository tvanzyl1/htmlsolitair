# 01 — Project Brief Agent

## Mission

Create a polished **single-draw Klondike Solitaire** game for the browser using plain HTML, CSS, and JavaScript.

The game must work well on:
- desktop with mouse
- tablet with touch
- phone with touch

The game should feel:
- polished
- inviting
- readable
- responsive
- premium
- satisfying to interact with

Use the attached generic style template as the **style source of truth** for overall feel, feedback, readability, mobile friendliness, and UI personality. fileciteturn0file0

## Core product goals

Build a solitaire game that:
1. is immediately understandable
2. feels good to interact with
3. has clean, clear card logic
4. works equally well with mouse and touch
5. is pleasant to replay
6. looks good enough to feel like a complete small web game, not a rough prototype

## Required game mode

Implement **Klondike Solitaire** with **single-draw** rules:
- standard 52-card deck
- 7 tableau columns
- 4 foundation piles
- 1 stock pile
- 1 waste pile
- turn over **one** card at a time from the stock
- when stock is empty, recycle the waste back into stock according to the selected rules for the build
- support standard descending alternating-colour tableau rules
- support ascending same-suit foundation rules from Ace to King
- face-down and face-up tableau behaviour should match normal Klondike expectations

## User interactions required

Support:
- click / tap to select cards or piles
- drag-and-drop for moving cards
- auto-place when appropriate and safe
- double-click / double-tap shortcuts where useful
- clear feedback for invalid moves
- quick restart / new game
- win state celebration

## Deliverables for this phase

Produce:
- a clear implementation plan
- a file structure
- a gameplay summary
- a list of major systems
- a list of assumptions
- a short risk list for touch interaction and responsive layout

## Constraints

- no frameworks required
- no unnecessary dependencies
- must be suitable for static hosting
- must be easy to extend later with themes, scoring, timer, undo, hints, and settings
- prioritise working gameplay and good interaction feel first

## Tone

Although the game is classic solitaire, the presentation should still feel lively and warm:
- elegant, not loud
- polished, not sterile
- slightly playful, not childish
- modern, not casino gaudy

## Success criteria

This phase succeeds if the output gives later agents a strong foundation for:
- rules correctness
- clean architecture
- responsive layout
- premium interaction feel
