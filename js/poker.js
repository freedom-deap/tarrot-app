(function () {
  "use strict";

  const data = window.TAROT_DATA;
  const rules = window.TAROT_GAME_RULES;
  const elements = {
    status: document.querySelector("#poker-status"),
    cpuHand: document.querySelector("#cpu-hand"),
    playerHand: document.querySelector("#player-hand"),
    cpuRole: document.querySelector("#cpu-role"),
    playerRole: document.querySelector("#player-role"),
    exchangeCount: document.querySelector("#exchange-count"),
    deal: document.querySelector("#poker-deal"),
    exchange: document.querySelector("#poker-exchange")
  };
  const state = { phase: "ready", deck: [], player: [], cpu: [], selected: new Set() };
  const minorCards = data.cards.filter((card) => card.arcana === "minor");
  const majorCards = data.cards.filter((card) => card.arcana === "major");

  function cardElement(card, hidden, selectable, index) {
    const element = document.createElement(selectable ? "button" : "div");
    element.className = "game-card";
    if (selectable) {
      element.type = "button";
      element.classList.toggle("is-selected", state.selected.has(index));
      element.setAttribute("aria-pressed", String(state.selected.has(index)));
      element.setAttribute("aria-label", `${card.name}${card.joker ? "、ジョーカー" : ""}を交換対象にする`);
      element.addEventListener("click", () => toggleSelection(index));
    }
    const image = document.createElement("img");
    image.src = hidden ? data.cardBack : card.image;
    image.alt = hidden ? "裏向きのカード" : card.name;
    const label = document.createElement("span");
    label.textContent = hidden ? "伏せ札" : card.joker ? `ジョーカー・${card.name}` : card.name;
    element.append(image, label);
    return element;
  }

  function renderHands(revealCpu = false) {
    elements.playerHand.replaceChildren(...state.player.map((card, index) => (
      cardElement(card, false, state.phase === "choosing", index)
    )));
    elements.cpuHand.replaceChildren(...state.cpu.map((card) => (
      cardElement(card, !revealCpu, false, -1)
    )));
    elements.exchangeCount.textContent = state.phase === "choosing"
      ? `交換するカード：${state.selected.size} / 3枚`
      : "";
  }

  function toggleSelection(index) {
    if (state.phase !== "choosing") return;
    if (state.selected.has(index)) state.selected.delete(index);
    else if (state.selected.size < 3) state.selected.add(index);
    else {
      elements.status.textContent = "交換できるのは3枚までです。";
      return;
    }
    elements.status.textContent = "交換するカードを選び、勝負してください。";
    renderHands();
  }

  function deal() {
    const jokers = rules.shuffle(majorCards).slice(0, 2).map((card) => ({ ...card, joker: true }));
    state.deck = rules.shuffle([...minorCards, ...jokers]);
    state.player = Array.from({ length: 5 }, () => state.deck.pop());
    state.cpu = Array.from({ length: 5 }, () => state.deck.pop());
    state.selected.clear();
    state.phase = "choosing";
    elements.status.textContent = "交換するカードを最大3枚選んでください。交換せず勝負もできます。";
    elements.cpuRole.textContent = "";
    elements.playerRole.textContent = "";
    elements.deal.hidden = true;
    elements.exchange.hidden = false;
    renderHands();
  }

  function cpuExchangeIndices() {
    const score = rules.evaluatePokerHand(state.cpu).score[0];
    if (score >= 4) return [];
    const counts = new Map();
    state.cpu.forEach((card) => {
      if (!card.joker) counts.set(card.number, (counts.get(card.number) || 0) + 1);
    });
    const candidates = state.cpu.map((card, index) => ({ card, index }))
      .filter(({ card }) => !card.joker && counts.get(card.number) === 1)
      .sort((a, b) => a.card.number - b.card.number);
    return candidates.slice(0, 3).map(({ index }) => index);
  }

  function exchangeAndCompare() {
    if (state.phase !== "choosing") return;
    const playerExchanges = state.selected.size;
    [...state.selected].forEach((index) => { state.player[index] = state.deck.pop(); });
    const cpuIndices = cpuExchangeIndices();
    cpuIndices.forEach((index) => { state.cpu[index] = state.deck.pop(); });
    state.phase = "finished";
    state.selected.clear();
    const playerResult = rules.evaluatePokerHand(state.player);
    const cpuResult = rules.evaluatePokerHand(state.cpu);
    const comparison = rules.compareScores(playerResult.score, cpuResult.score);
    elements.playerRole.textContent = playerResult.name;
    elements.cpuRole.textContent = cpuResult.name;
    elements.status.textContent = `${comparison > 0 ? "あなたの勝ち" : comparison < 0 ? "CPUの勝ち" : "引き分け"}。あなたは${playerExchanges}枚、CPUは${cpuIndices.length}枚交換しました。`;
    elements.exchange.hidden = true;
    elements.deal.hidden = false;
    elements.deal.textContent = "もう一度配る";
    renderHands(true);
  }

  elements.deal.addEventListener("click", deal);
  elements.exchange.addEventListener("click", exchangeAndCompare);
  elements.status.textContent = "カードを配ると対戦を始めます。";
}());
