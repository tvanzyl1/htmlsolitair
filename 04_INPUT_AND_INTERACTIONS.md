# 04 — Input and Interaction Agent

## Mission

Design and implement an interaction model that feels excellent with:
- mouse on desktop
- touch on tablet
- touch on phone

The game should feel forgiving, clear, and smooth.

## Interaction model

### Desktop
Support:
- click to select
- click destination to move if legal
- click stock to draw
- double-click for quick move to foundation
- drag-and-drop with mouse for cards and valid tableau runs

### Mobile / tablet
Support:
- tap to select
- tap destination to move
- drag with finger
- double-tap alternative if reliable, otherwise use smart single-tap behaviour plus action buttons only if needed
- ensure page does not accidentally scroll or zoom during card interaction

## Priority behaviour

The player should be able to complete a full game without frustration on touch devices.

Priorities:
1. cards are easy to grab
2. legal targets become visually obvious
3. invalid drops recover gracefully
4. stock draw is effortless
5. common actions require as few taps as possible

## Drag behaviour

When dragging:
- raise the card / stack visually above other elements
- use subtle scale-up or shadow increase
- show valid drop targets with highlight states
- maintain stable card stack spacing while dragging
- snap clearly into place on valid drop
- snap back smoothly on invalid drop

## Touch-specific considerations

- use generous invisible hit padding around card edges where needed
- prevent browser text selection and pull-to-refresh issues where practical
- avoid relying on hover
- ensure buttons are thumb-friendly
- allow safe cancellation if finger leaves play area

## Smart interaction suggestions

Helpful shortcuts:
- tap a face-up movable card to auto-move if exactly one strong legal destination exists
- double-click or double-tap sends card to foundation when appropriate
- tapping stock always draws instantly
- when selected, show clear highlight on the source card or stack

## Accessibility-minded interaction

Even if full accessibility is deferred, support:
- strong contrast highlights
- readable text
- large touch targets
- reduced-motion compatibility where practical
- no reliance on very fast gestures

## Deliverables

Produce:
- event handling plan
- pointer/mouse/touch strategy
- drag state logic
- tap-to-move logic
- input conflict prevention notes
- recommendations for making touch play feel premium rather than awkward
