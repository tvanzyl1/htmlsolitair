# 03 — Game Rules and State Agent

## Mission

Implement or specify the complete gameplay rules for **single-draw Klondike Solitaire**.

## Required rules

### Initial deal
- 7 tableau columns
- first column gets 1 card, second gets 2, and so on up to 7
- only the top card of each tableau pile starts face-up
- remaining cards go to stock
- waste starts empty
- foundations start empty

### Tableau rules
Allow moving:
- a single face-up card
- or a valid run of face-up cards

A valid tableau move requires:
- destination card rank is exactly one higher
- destination card is opposite colour
- example: black 7 onto red 8

Empty tableau spaces:
- only Kings may be placed there
- a valid run beginning with a King may also be placed there

### Foundation rules
- build up by suit from Ace to King
- only matching suit allowed
- only next rank allowed

### Stock / waste rules
- draw one card at a time from stock to waste
- when stock empties, allow recycling waste back to stock
- specify clearly whether recycle count is unlimited or configurable
- default recommendation: unlimited passes for accessibility unless product brief says otherwise

### Automatic behaviours
- flip exposed face-down tableau top card when uncovered
- detect win when all foundation piles are complete
- optionally allow safe auto-send to foundations

## Interaction policies

Support:
- drag a card or stack from tableau
- drag single top card from waste
- drag single eligible top card from foundation if reverse moves are allowed
- tap / click to attempt smart move
- double-click / double-tap to send eligible cards to foundation

## Invalid move feedback

Invalid actions should never feel dead or confusing.
Provide:
- snap-back animation
- brief shake or pulse on target / card
- subtle audio cue if sound is enabled
- no destructive side effects

## State design detail

The state should support:
- deterministic move validation
- reversible move history for future undo
- hint calculation later
- animation metadata without corrupting the game model

Recommended move history entry:
- source pile id
- destination pile id
- moved card ids
- whether a card flipped as part of the move
- whether stock recycled
- timestamp or move index

## Edge cases to handle

- tapping stock when empty
- dragging to invalid zones
- moving partial tableau runs incorrectly
- dropping a run onto a non-top tableau card incorrectly
- attempting to move face-down cards
- moving from foundation back to tableau if allowed
- responsive layout during a drag
- accidental scroll while touching on mobile

## Deliverables

Produce:
- precise legal move definitions
- pseudo-code or implementation-ready logic
- state transition map
- edge case checklist
- list of future rule toggles that could be added later without rewriting the system
