(function () {
  "use strict";

  const data = window.TAROT_DATA;
  const rules = window.TAROT_GAME_RULES;
  const elements = {
    status: document.querySelector("#blackjack-status"),
    dealerHand: document.querySelector("#dealer-hand"),
    playerHand: document.querySelector("#player-hand"),
    dealerValue: document.querySelector("#dealer-value"),
    playerValue: document.querySelector("#player-value"),
    deal: document.querySelector("#blackjack-deal"),
    hit: document.querySelector("#blackjack-hit"),
    stand: document.querySelector("#blackjack-stand")
  };
  const minorCards = data.cards.filter((card) => card.arcana === "minor");
  const state = { phase: "ready", deck: [], player: [], dealer: [] };

  function cardElement(card, hidden) {
    const element = document.createElement("div");
    element.className = "game-card";
    const image = document.createElement("img");
    image.src = hidden ? data.cardBack : card.image;
    image.alt = hidden ? "裏向きのカード" : card.name;
    const label = document.createElement("span");
    label.textContent = hidden ? "伏せ札" : card.name;
    element.append(image, label);
    return element;
  }

  function renderHands() {
    const playing = state.phase === "playing";
    elements.playerHand.replaceChildren(...state.player.map((card) => cardElement(card, false)));
    elements.dealerHand.replaceChildren(...state.dealer.map((card, index) => cardElement(card, playing && index === 1)));
    elements.playerValue.textContent = state.player.length ? `${rules.blackjackValue(state.player).total}点` : "";
    elements.dealerValue.textContent = state.dealer.length
      ? playing
        ? `公開札 ${rules.blackjackValue([state.dealer[0]]).total}点`
        : `${rules.blackjackValue(state.dealer).total}点`
      : "";
  }

  function deal() {
    state.deck = rules.shuffle(minorCards);
    state.player = [state.deck.pop(), state.deck.pop()];
    state.dealer = [state.deck.pop(), state.deck.pop()];
    state.phase = "playing";
    elements.deal.hidden = true;
    elements.hit.hidden = false;
    elements.stand.hidden = false;
    elements.status.textContent = "ヒットでカードを引くか、スタンドで勝負してください。";
    renderHands();
    if (rules.blackjackValue(state.player).total === 21) finishRound();
  }

  function finishRound() {
    if (state.phase !== "playing") return;
    const player = rules.blackjackValue(state.player).total;
    if (player <= 21) {
      while (rules.blackjackValue(state.dealer).total < 17) {
        state.dealer.push(state.deck.pop());
      }
    }
    const dealer = rules.blackjackValue(state.dealer).total;
    state.phase = "finished";
    elements.hit.hidden = true;
    elements.stand.hidden = true;
    elements.deal.hidden = false;
    elements.deal.textContent = "もう一度配る";
    const result = player > 21 ? "あなたの負け（バースト）"
      : dealer > 21 ? "あなたの勝ち（ディーラーがバースト）"
        : player > dealer ? "あなたの勝ち"
          : player < dealer ? "ディーラーの勝ち" : "引き分け";
    elements.status.textContent = `${result}。あなた ${player}点、ディーラー ${dealer}点。`;
    renderHands();
  }

  function hit() {
    if (state.phase !== "playing") return;
    state.player.push(state.deck.pop());
    renderHands();
    if (rules.blackjackValue(state.player).total >= 21) finishRound();
  }

  elements.deal.addEventListener("click", deal);
  elements.hit.addEventListener("click", hit);
  elements.stand.addEventListener("click", finishRound);
  elements.status.textContent = "カードを配るとゲームを始めます。";
}());
