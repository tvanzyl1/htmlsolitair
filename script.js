const SUITS = [
  { key: "hearts", symbol: "♥", color: "red" },
  { key: "diamonds", symbol: "♦", color: "red" },
  { key: "clubs", symbol: "♣", color: "black" },
  { key: "spades", symbol: "♠", color: "black" }
];

const RANKS = [
  { value: 1, label: "A" }, { value: 2, label: "2" }, { value: 3, label: "3" },
  { value: 4, label: "4" }, { value: 5, label: "5" }, { value: 6, label: "6" },
  { value: 7, label: "7" }, { value: 8, label: "8" }, { value: 9, label: "9" },
  { value: 10, label: "10" }, { value: 11, label: "J" }, { value: 12, label: "Q" },
  { value: 13, label: "K" }
];

const FOUNDATION_IDS = ["foundation-0", "foundation-1", "foundation-2", "foundation-3"];
const TABLEAU_IDS = ["tableau-0", "tableau-1", "tableau-2", "tableau-3", "tableau-4", "tableau-5", "tableau-6"];

const state = {
  cards: {},
  piles: {},
  selectedMove: null,
  drag: null,
  moveCount: 0,
  moveHistory: [],
  timerSeconds: 0,
  timerHandle: null,
  messageTimer: null,
  gameStarted: false,
  gameWon: false,
  interactionLocked: false,
  soundEnabled: false,
  drawCount: 1
};

const refs = {
  tableauRow: document.getElementById("tableauRow"),
  foundationRow: document.getElementById("foundationRow"),
  stockPile: document.getElementById("stockPile"),
  wastePile: document.getElementById("wastePile"),
  dragLayer: document.getElementById("dragLayer"),
  messageText: document.getElementById("messageText"),
  movesValue: document.getElementById("movesValue"),
  timeValue: document.getElementById("timeValue"),
  soundButton: document.getElementById("soundButton"),
  restartButton: document.getElementById("restartButton"),
  newGameButton: document.getElementById("newGameButton"),
  autoMoveButton: document.getElementById("autoMoveButton"),
  modeEyebrow: document.getElementById("modeEyebrow"),
  startOverlay: document.getElementById("startOverlay"),
  startDrawOneButton: document.getElementById("startDrawOneButton"),
  startDrawThreeButton: document.getElementById("startDrawThreeButton"),
  winOverlay: document.getElementById("winOverlay"),
  winSummary: document.getElementById("winSummary"),
  playAgainButton: document.getElementById("playAgainButton")
};

function init() {
  buildBoard();
  bindEvents();
  updateModeDisplay();
  startFreshGame(false);
  showOverlay(refs.startOverlay, true);
}

function buildBoard() {
  refs.foundationRow.innerHTML = "";
  refs.tableauRow.innerHTML = "";
  refs.stockPile.appendChild(createPileLabel("Stock"));
  refs.wastePile.appendChild(createPileLabel("Waste"));

  FOUNDATION_IDS.forEach((id, index) => {
    refs.foundationRow.appendChild(createPileElement(id, "foundation", `Foundation ${index + 1}`));
  });

  TABLEAU_IDS.forEach((id, index) => {
    refs.tableauRow.appendChild(createPileElement(id, "tableau", `Column ${index + 1}`));
  });
}

function createPileElement(id, type, label) {
  const pile = document.createElement("div");
  pile.className = `pile pile-${type}`;
  pile.dataset.pileId = id;
  pile.dataset.pileType = type;
  pile.appendChild(createPileLabel(label));
  return pile;
}

function createPileLabel(text) {
  const label = document.createElement("span");
  label.className = "pile-label";
  label.textContent = text;
  return label;
}

function bindEvents() {
  refs.stockPile.addEventListener("click", onStockClick);
  refs.wastePile.addEventListener("click", onPileClick);
  refs.tableauRow.addEventListener("click", onPileClick);
  refs.foundationRow.addEventListener("click", onPileClick);
  refs.wastePile.addEventListener("dblclick", onDoubleClick);
  refs.tableauRow.addEventListener("dblclick", onDoubleClick);
  refs.foundationRow.addEventListener("dblclick", onDoubleClick);
  refs.startDrawOneButton.addEventListener("click", () => beginNewGameWithMode(1));
  refs.startDrawThreeButton.addEventListener("click", () => beginNewGameWithMode(3));
  refs.newGameButton.addEventListener("click", openModePicker);
  refs.restartButton.addEventListener("click", restartCurrentGame);
  refs.playAgainButton.addEventListener("click", () => {
    showOverlay(refs.winOverlay, false);
    openModePicker();
  });
  refs.soundButton.addEventListener("click", toggleSound);
  refs.autoMoveButton.addEventListener("click", autoPlaceAnyCard);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);
  document.addEventListener("pointercancel", cancelDrag);
  document.addEventListener("keydown", onKeyDown);
}

function openModePicker() {
  state.selectedMove = null;
  cancelDrag();
  showOverlay(refs.winOverlay, false);
  showOverlay(refs.startOverlay, true);
  setMessage("Choose draw 1 or draw 3 for the next deal.");
}

function beginNewGameWithMode(drawCount) {
  state.drawCount = drawCount;
  updateModeDisplay();
  showOverlay(refs.startOverlay, false);
  startFreshGame(true);
  setMessage(`${getDrawModeLabel()} game ready. Tap stock for the next draw.`);
}

function restartCurrentGame() {
  startFreshGame(true);
  setMessage(`Fresh start. ${getDrawModeLabel()} rules, new shuffle.`);
}

function startFreshGame(startActive = false) {
  clearTimer();
  state.selectedMove = null;
  state.drag = null;
  state.moveCount = 0;
  state.moveHistory = [];
  state.timerSeconds = 0;
  state.gameWon = false;
  state.interactionLocked = false;
  state.gameStarted = startActive;
  resetPiles();

  const deck = createDeck();
  shuffle(deck);
  dealNewGame(deck);
  render();
  refs.movesValue.textContent = "0";
  refs.timeValue.textContent = "00:00";
  showOverlay(refs.winOverlay, false);
  if (state.gameStarted) {
    ensureTimer();
  }
  setMessage(`New ${getDrawModeLabel().toLowerCase()} deal ready. Build up foundations from Ace to King.`);
}

function resetPiles() {
  state.cards = {};
  state.piles = {
    stock: { id: "stock", type: "stock", cards: [] },
    waste: { id: "waste", type: "waste", cards: [] }
  };

  FOUNDATION_IDS.forEach((id) => {
    state.piles[id] = { id, type: "foundation", cards: [] };
  });

  TABLEAU_IDS.forEach((id) => {
    state.piles[id] = { id, type: "tableau", cards: [] };
  });
}

function createDeck() {
  const deck = [];
  let uid = 0;
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      const card = {
        id: `card-${uid++}`,
        suit: suit.key,
        symbol: suit.symbol,
        color: suit.color,
        rank: rank.value,
        rankLabel: rank.label,
        faceUp: false
      };
      state.cards[card.id] = card;
      deck.push(card.id);
    });
  });
  return deck;
}

function shuffle(deck) {
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
}

function dealNewGame(deck) {
  TABLEAU_IDS.forEach((pileId, index) => {
    for (let draw = 0; draw <= index; draw += 1) {
      const cardId = deck.pop();
      state.cards[cardId].faceUp = draw === index;
      state.piles[pileId].cards.push(cardId);
    }
  });
  state.piles.stock.cards = deck.reverse();
}

function render() {
  renderPile(refs.stockPile, state.piles.stock);
  renderPile(refs.wastePile, state.piles.waste);
  FOUNDATION_IDS.forEach((id) => renderPile(document.querySelector(`[data-pile-id="${id}"]`), state.piles[id]));
  TABLEAU_IDS.forEach((id) => renderPile(document.querySelector(`[data-pile-id="${id}"]`), state.piles[id]));
  refs.movesValue.textContent = String(state.moveCount);
  refs.timeValue.textContent = formatTime(state.timerSeconds);
  refs.autoMoveButton.disabled = state.gameWon;
  refs.restartButton.disabled = state.gameWon;
  clearHighlights();
  applySelectionHighlights();
}

function renderPile(pileEl, pile) {
  const label = pileEl.querySelector(".pile-label") || createPileLabel("");
  pileEl.innerHTML = "";
  pileEl.appendChild(label);
  pile.cards.forEach((cardId, index) => {
    pileEl.appendChild(createCardElement(state.cards[cardId], pile, index));
  });
}

function createCardElement(card, pile, index) {
  const cardEl = document.createElement("article");
  cardEl.className = `card ${card.color} ${card.faceUp ? "face-up" : "face-down"}`;
  cardEl.dataset.cardId = card.id;
  cardEl.dataset.pileId = pile.id;
  cardEl.style.top = `${getCardTopOffset(pile.type, index)}px`;
  cardEl.style.zIndex = String(index + 1);

  if (pile.type === "waste" && index === pile.cards.length - 1) {
    cardEl.classList.add("top-waste");
  }

  if (card.faceUp) {
    cardEl.innerHTML = `
      <div class="card-corner top">
        <span class="card-rank">${card.rankLabel}</span>
        <span class="card-suit">${card.symbol}</span>
      </div>
      <div class="card-center">${card.symbol}</div>
      <div class="card-corner bottom">
        <span class="card-rank">${card.rankLabel}</span>
        <span class="card-suit">${card.symbol}</span>
      </div>
    `;
  }

  if (isMovableCard(card.id, pile.id)) {
    cardEl.addEventListener("pointerdown", onPointerDown);
  } else if (!card.faceUp) {
    cardEl.style.cursor = "default";
  }

  return cardEl;
}

function getCardTopOffset(type, index) {
  if (type === "tableau") {
    return index * getStackOffset();
  }
  if (type === "waste") {
    return Math.min(index, 2) * 3;
  }
  return 0;
}

function getStackOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--stack-offset");
  return parseFloat(value) || 24;
}

function onStockClick() {
  if (!canInteract()) {
    return;
  }
  state.selectedMove = null;

  if (state.piles.stock.cards.length > 0) {
    const drawnCardIds = [];
    const drawLimit = Math.min(state.drawCount, state.piles.stock.cards.length);
    for (let index = 0; index < drawLimit; index += 1) {
      const cardId = state.piles.stock.cards.pop();
      state.cards[cardId].faceUp = true;
      state.piles.waste.cards.push(cardId);
      drawnCardIds.push(cardId);
    }
    recordMove("draw", "stock", "waste", drawnCardIds, null, false);
    incrementMoveCount();
    maybeStartGame();
    render();
    setMessage(`${drawnCardIds.length} ${drawnCardIds.length === 1 ? "card" : "cards"} drawn to waste.`);
    return;
  }

  if (state.piles.waste.cards.length === 0) {
    pulseInvalid(refs.stockPile);
    setMessage("No more cards to draw.", "negative");
    return;
  }

  recycleWasteToStock();
}

function recycleWasteToStock() {
  const recycled = state.piles.waste.cards.splice(0).reverse();
  recycled.forEach((cardId) => {
    state.cards[cardId].faceUp = false;
  });
  state.piles.stock.cards.push(...recycled);
  recordMove("recycle", "waste", "stock", recycled.slice(), null, true);
  incrementMoveCount();
  render();
  setMessage("Waste recycled back to stock.");
}

function onPileClick(event) {
  if (!canInteract()) {
    return;
  }

  const cardEl = event.target.closest(".card");
  if (cardEl) {
    handleCardTap(cardEl.dataset.cardId);
    return;
  }

  const pileEl = event.target.closest(".pile");
  if (!pileEl || !state.selectedMove) {
    return;
  }

  const result = attemptMove(state.selectedMove, pileEl.dataset.pileId);
  if (!result.moved) {
    pulseInvalid(pileEl);
    setMessage("No move there.", "negative");
  }
}

function onDoubleClick(event) {
  if (!canInteract()) {
    return;
  }
  const cardEl = event.target.closest(".card");
  if (!cardEl) {
    return;
  }
  if (!autoMoveCardToFoundation(cardEl.dataset.cardId)) {
    pulseInvalid(cardEl);
    setMessage("That card can’t go home yet.", "negative");
  }
}

function handleCardTap(cardId) {
  const card = state.cards[cardId];
  if (!card?.faceUp) {
    setMessage("Face-down cards stay put until uncovered.", "negative");
    return;
  }

  if (state.selectedMove?.cardIds[0] === cardId) {
    state.selectedMove = null;
    render();
    return;
  }

  const move = buildMoveFromCard(cardId);
  if (!move) {
    return;
  }

  const destinations = findLegalDestinations(move);
  if (destinations.length === 1 && attemptMove(move, destinations[0]).moved) {
    return;
  }

  state.selectedMove = move;
  render();
  setMessage("Card selected. Tap a highlighted destination or drag.");
}

function onPointerDown(event) {
  if (!canInteract()) {
    return;
  }

  const cardId = event.currentTarget.dataset.cardId;
  const move = buildMoveFromCard(cardId);
  if (!move) {
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  state.selectedMove = move;
  state.drag = {
    move,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    ghost: createDragGhost(move.cardIds)
  };

  refs.dragLayer.appendChild(state.drag.ghost);
  positionGhost(event.clientX, event.clientY);
  render();
  event.preventDefault();
}

function onPointerMove(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }
  positionGhost(event.clientX, event.clientY);
}

function onPointerUp(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }

  const targetPileId = getDropTargetPileId(event.clientX, event.clientY);
  const move = state.drag.move;
  removeGhost();
  state.drag = null;

  if (!targetPileId) {
    render();
    setMessage("Move cancelled.");
    return;
  }

  const result = attemptMove(move, targetPileId);
  if (!result.moved) {
    pulseInvalid(document.querySelector(`[data-pile-id="${targetPileId}"]`));
    setMessage("That stack won’t fit there.", "negative");
    render();
  }
}

function cancelDrag() {
  if (!state.drag) {
    return;
  }
  removeGhost();
  state.drag = null;
  render();
}

function createDragGhost(cardIds) {
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  cardIds.forEach((cardId, index) => {
    const card = state.cards[cardId];
    const cardEl = createCardElement(card, { id: "ghost", type: "tableau", cards: cardIds }, index);
    cardEl.classList.add("dragging");
    cardEl.style.top = `${index * getStackOffset()}px`;
    ghost.appendChild(cardEl);
  });
  return ghost;
}

function positionGhost(x, y) {
  if (!state.drag) {
    return;
  }
  state.drag.ghost.style.transform = `translate(${x - state.drag.offsetX}px, ${y - state.drag.offsetY}px)`;
}

function removeGhost() {
  if (state.drag?.ghost?.parentNode) {
    state.drag.ghost.parentNode.removeChild(state.drag.ghost);
  }
}

function getDropTargetPileId(x, y) {
  const element = document.elementFromPoint(x, y);
  return element?.closest(".pile")?.dataset.pileId || null;
}

function buildMoveFromCard(cardId) {
  const location = locateCard(cardId);
  if (!location) {
    return null;
  }

  const pile = state.piles[location.pileId];
  const index = pile.cards.indexOf(cardId);
  const cardIds = pile.type === "tableau" ? pile.cards.slice(index) : [cardId];

  if (pile.type === "waste" || pile.type === "foundation") {
    if (index !== pile.cards.length - 1) {
      return null;
    }
  }

  if (pile.type === "tableau" && !isValidFaceUpRun(cardIds)) {
    return null;
  }

  return {
    sourcePileId: pile.id,
    sourcePileType: pile.type,
    cardIds
  };
}

function attemptMove(move, destinationPileId) {
  const validation = validateMove(move, destinationPileId);
  if (!validation.valid) {
    return { moved: false };
  }

  commitMove(move, destinationPileId);
  state.selectedMove = null;
  maybeStartGame();
  render();
  return { moved: true };
}

function validateMove(move, destinationPileId) {
  if (!move || move.sourcePileId === destinationPileId) {
    return { valid: false };
  }

  const destination = state.piles[destinationPileId];
  if (!destination) {
    return { valid: false };
  }

  const movingCards = move.cardIds.map((cardId) => state.cards[cardId]);
  const firstCard = movingCards[0];

  if (destination.type === "foundation") {
    if (movingCards.length !== 1) {
      return { valid: false };
    }
    const topId = destination.cards[destination.cards.length - 1];
    if (!topId) {
      return { valid: firstCard.rank === 1 };
    }
    const topCard = state.cards[topId];
    return { valid: firstCard.suit === topCard.suit && firstCard.rank === topCard.rank + 1 };
  }

  if (destination.type === "tableau") {
    const topId = destination.cards[destination.cards.length - 1];
    if (!topId) {
      return { valid: firstCard.rank === 13 };
    }
    const topCard = state.cards[topId];
    return { valid: topCard.faceUp && firstCard.color !== topCard.color && firstCard.rank === topCard.rank - 1 };
  }

  return { valid: false };
}

function commitMove(move, destinationPileId) {
  const source = state.piles[move.sourcePileId];
  const destination = state.piles[destinationPileId];
  const startIndex = source.cards.indexOf(move.cardIds[0]);
  const movedCardIds = source.cards.splice(startIndex, move.cardIds.length);
  destination.cards.push(...movedCardIds);

  let flippedCardId = null;
  if (source.type === "tableau") {
    const exposed = source.cards[source.cards.length - 1];
    if (exposed && !state.cards[exposed].faceUp) {
      state.cards[exposed].faceUp = true;
      flippedCardId = exposed;
    }
  }

  recordMove("move", move.sourcePileId, destinationPileId, movedCardIds, flippedCardId, false);
  incrementMoveCount();
  playFeedback(destination.type === "foundation" ? "foundation" : "place");

  if (destination.type === "foundation") {
    const placed = state.cards[movedCardIds[0]];
    setMessage(`${placed.rankLabel}${placed.symbol} placed on foundation.`, "positive");
  } else {
    setMessage("Nice move.", "positive");
  }

  checkWinCondition();
}

function locateCard(cardId) {
  for (const pile of Object.values(state.piles)) {
    if (pile.cards.includes(cardId)) {
      return { pileId: pile.id };
    }
  }
  return null;
}

function isMovableCard(cardId, pileId) {
  const pile = state.piles[pileId];
  const card = state.cards[cardId];
  if (!pile || !card?.faceUp) {
    return false;
  }
  if (pile.type === "stock") {
    return false;
  }
  if (pile.type === "waste" || pile.type === "foundation") {
    return pile.cards[pile.cards.length - 1] === cardId;
  }
  const index = pile.cards.indexOf(cardId);
  return index >= 0 && isValidFaceUpRun(pile.cards.slice(index));
}

function isValidFaceUpRun(cardIds) {
  if (cardIds.length === 0) {
    return false;
  }
  for (let index = 0; index < cardIds.length; index += 1) {
    const current = state.cards[cardIds[index]];
    if (!current.faceUp) {
      return false;
    }
    if (index < cardIds.length - 1) {
      const next = state.cards[cardIds[index + 1]];
      if (current.color === next.color || current.rank !== next.rank + 1) {
        return false;
      }
    }
  }
  return true;
}

function findLegalDestinations(move) {
  const destinations = [];
  [...FOUNDATION_IDS, ...TABLEAU_IDS].forEach((pileId) => {
    if (validateMove(move, pileId).valid) {
      destinations.push(pileId);
    }
  });
  return destinations;
}

function clearHighlights() {
  document.querySelectorAll(".pile").forEach((pile) => {
    pile.classList.remove("is-valid-target", "is-invalid");
  });
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("selected", "invalid");
  });
}

function applySelectionHighlights() {
  if (!state.selectedMove) {
    return;
  }
  state.selectedMove.cardIds.forEach((cardId) => {
    document.querySelector(`[data-card-id="${cardId}"]`)?.classList.add("selected");
  });
  findLegalDestinations(state.selectedMove).forEach((pileId) => {
    document.querySelector(`[data-pile-id="${pileId}"]`)?.classList.add("is-valid-target");
  });
}

function pulseInvalid(element) {
  if (!element) {
    return;
  }
  const className = element.classList.contains("card") ? "invalid" : "is-invalid";
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  playFeedback("invalid");
}

function autoMoveCardToFoundation(cardId) {
  const move = buildMoveFromCard(cardId);
  if (!move || move.cardIds.length !== 1 || !isSafeFoundationMove(cardId)) {
    return false;
  }
  const foundationId = FOUNDATION_IDS.find((pileId) => validateMove(move, pileId).valid);
  if (!foundationId) {
    return false;
  }
  attemptMove(move, foundationId);
  return true;
}

function autoPlaceAnyCard() {
  if (!canInteract()) {
    return;
  }
  const candidates = [...TABLEAU_IDS, "waste"];
  for (const pileId of candidates) {
    const pile = state.piles[pileId];
    const cardId = pile.cards[pile.cards.length - 1];
    if (cardId && autoMoveCardToFoundation(cardId)) {
      return;
    }
  }
  setMessage("Nothing ready for the foundations yet.", "negative");
}

function isSafeFoundationMove(cardId) {
  const card = state.cards[cardId];
  if (card.rank <= 2) {
    return true;
  }
  const oppositeSuits = SUITS.filter((suit) => suit.color !== card.color).map((suit) => suit.key);
  return oppositeSuits.every((suit) => getFoundationTopRank(suit) >= card.rank - 1);
}

function getFoundationTopRank(suitKey) {
  for (const foundationId of FOUNDATION_IDS) {
    const topId = state.piles[foundationId].cards[state.piles[foundationId].cards.length - 1];
    if (topId && state.cards[topId].suit === suitKey) {
      return state.cards[topId].rank;
    }
  }
  return 0;
}

function checkWinCondition() {
  const total = FOUNDATION_IDS.reduce((sum, pileId) => sum + state.piles[pileId].cards.length, 0);
  if (total !== 52) {
    return;
  }
  state.gameWon = true;
  state.interactionLocked = true;
  clearTimer();
  refs.winSummary.textContent = `Solved in ${formatTime(state.timerSeconds)} with ${state.moveCount} moves.`;
  showOverlay(refs.winOverlay, true);
  setMessage("Table complete. Beautiful finish.", "positive");
  launchCelebration();
}

function launchCelebration() {
  const winCard = refs.winOverlay.querySelector(".win-card");
  for (let index = 0; index < 18; index += 1) {
    const chip = document.createElement("span");
    chip.className = "celebration-chip";
    chip.style.left = `${Math.random() * 100}%`;
    chip.style.top = `${-10 - Math.random() * 20}px`;
    chip.style.background = index % 2 === 0 ? "var(--accent)" : "var(--good)";
    chip.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    chip.style.animationDelay = `${Math.random() * 160}ms`;
    winCard.appendChild(chip);
    window.setTimeout(() => chip.remove(), 1500);
  }
}

function recordMove(type, sourcePileId, destinationPileId, movedCardIds, flippedCardId, stockRecycled) {
  state.moveHistory.push({
    type,
    sourcePileId,
    destinationPileId,
    movedCardIds,
    flippedCardId,
    stockRecycled,
    moveIndex: state.moveHistory.length + 1,
    timestamp: Date.now()
  });
}

function incrementMoveCount() {
  state.moveCount += 1;
}

function maybeStartGame() {
  if (!state.gameStarted) {
    state.gameStarted = true;
    ensureTimer();
  }
}

function ensureTimer() {
  if (state.timerHandle || state.gameWon) {
    return;
  }
  state.timerHandle = window.setInterval(() => {
    state.timerSeconds += 1;
    refs.timeValue.textContent = formatTime(state.timerSeconds);
  }, 1000);
}

function clearTimer() {
  if (state.timerHandle) {
    window.clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function setMessage(text, tone = "") {
  refs.messageText.textContent = text;
  refs.messageText.classList.remove("is-positive", "is-negative");
  if (tone === "positive") {
    refs.messageText.classList.add("is-positive");
  }
  if (tone === "negative") {
    refs.messageText.classList.add("is-negative");
  }
  window.clearTimeout(state.messageTimer);
  state.messageTimer = window.setTimeout(() => {
    refs.messageText.classList.remove("is-positive", "is-negative");
  }, 1800);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  refs.soundButton.textContent = state.soundEnabled ? "Sound On" : "Sound Off";
  refs.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
  setMessage(state.soundEnabled ? "Sound enabled." : "Sound muted.");
}

function updateModeDisplay() {
  refs.modeEyebrow.textContent = getDrawModeLabel();
}

function getDrawModeLabel() {
  return state.drawCount === 3 ? "Draw 3" : "Draw 1";
}

function playFeedback(type) {
  if (!state.soundEnabled || !window.AudioContext) {
    return;
  }
  const tones = {
    foundation: [680, 980],
    place: [560, 760],
    invalid: [220, 180]
  };
  const notes = tones[type];
  if (!notes) {
    return;
  }
  const audioContext = playFeedback.audioContext || new AudioContext();
  playFeedback.audioContext = audioContext;
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.02;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    const startAt = audioContext.currentTime + index * 0.05;
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.08);
  });
}

function onKeyDown(event) {
  if (event.key === "Escape") {
    state.selectedMove = null;
    cancelDrag();
    render();
    setMessage("Selection cleared.");
  }
  if (event.key.toLowerCase() === "n") {
    startFreshGame();
  }
}

function canInteract() {
  return !state.interactionLocked;
}

function showOverlay(element, show) {
  element.classList.toggle("visible", show);
  element.setAttribute("aria-hidden", String(!show));
}

init();
