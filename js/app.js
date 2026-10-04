(function () {
  "use strict";

  const ANIMATION_MS = 720;
  const data = window.TAROT_DATA;

  const elements = {
    instruction: document.querySelector("#instruction"),
    selector: document.querySelector("#spread-selector"),
    spreadList: document.querySelector("#spread-list"),
    stage: document.querySelector("#reading-stage"),
    table: document.querySelector("#table"),
    stageAction: document.querySelector("#stage-action"),
    panel: document.querySelector("#reading-panel"),
    positionName: document.querySelector("#position-name"),
    cardName: document.querySelector("#card-name"),
    orientation: document.querySelector("#orientation"),
    cardMeaning: document.querySelector("#card-meaning"),
    positionMeaning: document.querySelector("#position-meaning")
  };

  const state = {
    phase: "selecting",
    spread: null,
    deck: [],
    reading: [],
    revealedCount: 0
  };

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function preloadImage(source) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({ source, loaded: true });
      image.onerror = () => resolve({ source, loaded: false });
      image.src = source;
    });
  }

  async function preloadCardImages() {
    const sources = [data.cardBack, ...data.cards.map((card) => card.image)];
    const results = await Promise.all(sources.map(preloadImage));
    return results.filter((result) => !result.loaded);
  }

  function setInstruction(text) {
    elements.instruction.textContent = text;
  }

  function renderSpreadOptions() {
    const fragment = document.createDocumentFragment();
    data.spreads.forEach((spread) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "spread-option";
      button.dataset.spreadId = spread.id;
      button.disabled = true;
      button.innerHTML = `<strong>${spread.name}</strong><span>${spread.description}</span>`;
      button.addEventListener("click", () => startReading(spread));
      fragment.append(button);
    });
    elements.spreadList.replaceChildren(fragment);
  }

  function createDeck(spread) {
    const availableCards = spread.positions.length === 1
      ? data.cards.filter((card) => card.arcana === "major")
      : data.cards;

    return shuffle(availableCards).map((card) => ({
      card,
      reversed: Math.random() < 0.5
    }));
  }

  function createReading(deck, spread) {
    return deck.slice(0, spread.positions.length).map((entry, index) => ({
      ...entry,
      position: spread.positions[index]
    }));
  }

  function randomScatteredPosition() {
    return {
      x: 12 + Math.random() * 76,
      y: 18 + Math.random() * 64,
      rotation: -38 + Math.random() * 76
    };
  }

  function createCardElement(entry, deckIndex, readingCount) {
    const scattered = randomScatteredPosition();
    const isReadingCard = deckIndex < readingCount;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tarot-card";
    button.dataset.deckIndex = String(deckIndex);
    if (isReadingCard) {
      button.classList.add("reading-card");
      button.dataset.index = String(deckIndex);
    }
    button.disabled = true;
    button.style.left = `${scattered.x}%`;
    button.style.top = `${scattered.y}%`;
    button.style.transform = `translate(-50%, -50%) rotate(${scattered.rotation}deg)`;
    button.setAttribute("aria-label", "裏向きのカード");
    button.innerHTML = `
      <span class="card-inner">
        <img class="card-face card-back" src="${data.cardBack}" alt="カードの裏面">
        <img class="card-face card-front${entry.reversed ? " is-reversed" : ""}" src="${entry.card.image}" alt="">
      </span>
    `;
    if (isReadingCard) {
      button.addEventListener("click", () => revealCard(deckIndex));
    }
    return button;
  }

  async function initialize() {
    renderSpreadOptions();
    setInstruction("imgディレクトリからカード画像を読み込んでいます…");

    const failures = await preloadCardImages();
    elements.spreadList.querySelectorAll(".spread-option").forEach((button) => {
      button.disabled = false;
    });

    if (failures.length > 0) {
      console.warn("読み込めなかったカード画像:", failures.map(({ source }) => source));
      setInstruction(`画像${failures.length}件を読み込めませんでした。ファイル配置を確認してください`);
      return;
    }

    setInstruction("スプレッドを選んでください");
  }

  function startReading(spread) {
    state.phase = "scattered";
    state.spread = spread;
    state.deck = createDeck(spread);
    state.reading = createReading(state.deck, spread);
    state.revealedCount = 0;

    elements.selector.classList.add("is-hidden");
    elements.panel.classList.add("is-hidden");
    elements.stage.classList.remove("is-hidden");
    elements.stageAction.classList.remove("is-hidden");
    elements.stageAction.textContent = "カードを混ぜる";
    elements.stageAction.onclick = shuffleAndDeal;

    const cards = state.deck.map((entry, deckIndex) => (
      createCardElement(entry, deckIndex, state.reading.length)
    ));
    elements.table.replaceChildren(...cards);
    setInstruction(`${state.deck.length}枚のカードを混ぜてください`);
  }

  async function shuffleAndDeal() {
    if (state.phase !== "scattered") return;
    state.phase = "shuffling";
    elements.stageAction.classList.add("is-hidden");
    setInstruction("カードを混ぜています…");

    const cardElements = [...elements.table.querySelectorAll(".tarot-card")];
    for (let pass = 0; pass < 3; pass += 1) {
      cardElements.forEach((card) => {
        const position = randomScatteredPosition();
        card.style.left = `${position.x}%`;
        card.style.top = `${position.y}%`;
        card.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
      });
      await wait(ANIMATION_MS);
    }

    cardElements.forEach((card, index) => {
      card.style.zIndex = String(index + 1);
      card.style.left = "50%";
      card.style.top = "48%";
      card.style.transform = `translate(-50%, -50%) rotate(${index * 0.5}deg)`;
    });
    await wait(ANIMATION_MS);
    await dealCards(cardElements);
  }

  async function dealCards(cardElements) {
    state.phase = "dealing";
    setInstruction(`${state.spread.name}にカードを並べています…`);

    const readingCards = cardElements.slice(0, state.reading.length);

    for (let index = 0; index < readingCards.length; index += 1) {
      const card = readingCards[index];
      const position = state.reading[index].position;
      card.classList.add("is-dealt");
      card.style.zIndex = String(cardElements.length + index + 1);
      card.style.left = `${position.x}%`;
      card.style.top = `${position.y}%`;
      card.style.transform = "translate(-50%, -50%) rotate(0deg)";
      const label = document.createElement("span");
      label.className = "position-label";
      label.style.left = `${position.x}%`;
      label.style.top = `${position.y}%`;
      label.textContent = position.label;
      elements.table.prepend(label);
      await wait(260);
    }

    await wait(ANIMATION_MS);
    state.phase = "revealing";
    enableNextCard();
  }

  function enableNextCard() {
    const cards = [...elements.table.querySelectorAll(".reading-card")];
    cards.forEach((card, index) => {
      const canReveal = index === state.revealedCount;
      const canReview = index < state.revealedCount;
      card.classList.toggle("can-reveal", canReveal);
      card.classList.toggle("can-review", canReview);
      card.disabled = !canReveal && !canReview;
    });

    if (state.revealedCount < cards.length) {
      const nextPosition = state.reading[state.revealedCount].position.label;
      setInstruction(`「${nextPosition}」のカードを開いてください`);
    }
  }

  function revealCard(index) {
    if (index < state.revealedCount) {
      showMeaning(state.reading[index]);
      return;
    }

    if (state.phase !== "revealing" || index !== state.revealedCount) return;
    const entry = state.reading[index];
    const cardElement = elements.table.querySelector(`.tarot-card[data-index="${index}"]`);
    cardElement.classList.add("is-revealed");
    cardElement.classList.remove("can-reveal");
    cardElement.disabled = true;
    cardElement.setAttribute("aria-label", `${entry.card.name}、${entry.reversed ? "逆位置" : "正位置"}`);

    showMeaning(entry);
    state.revealedCount += 1;

    if (state.revealedCount === state.reading.length) {
      state.phase = "completed";
      enableNextCard();
      setInstruction("すべてのカードを開きました");
      elements.stageAction.textContent = "もう一度占う";
      elements.stageAction.onclick = resetReading;
      elements.stageAction.classList.remove("is-hidden");
      return;
    }

    enableNextCard();
  }

  function formatMeaningList(values) {
    const meanings = values.filter(Boolean);
    return meanings.length > 0 ? meanings.join("、") : "意味は後から設定します。";
  }

  function formatCardMeaning(meaning) {
    if (Array.isArray(meaning)) return formatMeaningList(meaning);
    return [
      `スート：${formatMeaningList(meaning.suit)}`,
      `数字・人物札：${formatMeaningList(meaning.rank)}`
    ].join("\n");
  }
  function showMeaning(entry) {
    const orientationKey = entry.reversed ? "reversed" : "upright";
    elements.positionName.textContent = entry.position.label;
    elements.cardName.textContent = entry.card.name;
    elements.orientation.textContent = entry.reversed ? "逆位置" : "正位置";
    elements.cardMeaning.textContent = formatCardMeaning(entry.card.meanings[orientationKey]);
    elements.positionMeaning.textContent = entry.position.meaning;
    elements.panel.classList.remove("is-hidden");
  }

  function resetReading() {
    state.phase = "selecting";
    state.spread = null;
    state.deck = [];
    state.reading = [];
    state.revealedCount = 0;
    elements.table.replaceChildren();
    elements.stage.classList.add("is-hidden");
    elements.panel.classList.add("is-hidden");
    elements.stageAction.classList.add("is-hidden");
    elements.selector.classList.remove("is-hidden");
    setInstruction("スプレッドを選んでください");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  initialize();
}());
