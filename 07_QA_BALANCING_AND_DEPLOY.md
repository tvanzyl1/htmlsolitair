# 07 — QA, Finishing, and Deploy Agent

## Mission

Prepare the solitaire game to feel stable, polished, and ready for static web hosting.

## QA checklist

### Rules correctness
Verify:
- initial deal is correct
- single-draw stock works
- waste recycling works as intended
- tableau move rules are correct
- foundation rules are correct
- empty tableau only accepts Kings
- facedown cards flip correctly
- win is detected correctly

### Interaction quality
Verify:
- mouse drag works smoothly
- click-to-move works
- touch drag works
- touch tap-to-move works
- invalid moves snap back reliably
- no accidental browser scrolling ruins play on mobile
- small screens remain playable

### Visual quality
Verify:
- no overlapping broken layouts
- cards remain readable
- buttons are easy to press
- overlays are centred and attractive
- animations do not feel sluggish

### Performance
Verify:
- runs smoothly on phone browsers
- no memory leaks from repeated new games
- drag interactions stay responsive
- animations do not jitter excessively

## Nice-to-have features if time allows

Optional additions:
- undo
- hint
- move counter
- timer
- score toggle
- settings panel
- theme selection
- left-handed layout option
- auto-complete when win is inevitable

## Deployment target

Game should be deployable to GitHub Pages or similar static hosting.

Requirements:
- no server dependency
- no local-only assumptions
- all assets referenced with relative paths
- straightforward open-and-play behaviour

## README expectations

Project README should include:
- game overview
- controls for desktop and mobile
- rules summary
- how to run locally
- how to deploy to GitHub Pages
- known extension ideas

## Finishing standard

Do not stop at “technically works.”
Aim for:
- polished first impression
- pleasant interaction feel
- no confusing moments
- replayable, neat, complete small game energy

## Final deliverables

Produce:
- QA checklist
- bug-risk list
- polish pass recommendations
- deployment checklist
- launch-ready definition of done
