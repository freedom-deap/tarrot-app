(function () {
  "use strict";

  const suits = ["wands", "cups", "swords", "pentacles"];
  const wildOptions = suits.flatMap((suit) => (
    Array.from({ length: 14 }, (_, index) => ({ suit, rank: index + 2 }))
  ));
  const pokerNames = [
    "ハイカード", "ワンペア", "ツーペア", "スリーカード", "ストレート",
    "フラッシュ", "フルハウス", "フォーカード", "ストレートフラッシュ", "ファイブカード"
  ];

  function shuffle(items) {
    const cards = [...items];
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[other]] = [cards[other], cards[index]];
    }
    return cards;
  }

  function compareScores(left, right) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      const difference = (left[index] || 0) - (right[index] || 0);
      if (difference !== 0) return Math.sign(difference);
    }
    return 0;
  }

  function straightHigh(ranks) {
    const unique = [...new Set(ranks)].sort((a, b) => a - b);
    if (unique.length !== 5) return 0;
    if (unique.every((rank, index) => rank === unique[0] + index)) return unique[4];
    return unique.join(",") === "2,3,4,5,15" ? 5 : 0;
  }

  function scoreNatural(cards) {
    const ranks = cards.map((card) => card.rank);
    const counts = new Map();
    ranks.forEach((rank) => counts.set(rank, (counts.get(rank) || 0) + 1));
    const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    const flush = cards.every((card) => card.suit === cards[0].suit);
    const straight = straightHigh(ranks);
    const sorted = [...ranks].sort((a, b) => b - a);

    if (groups[0][1] === 5) return [9, groups[0][0]];
    if (flush && straight) return [8, straight];
    if (groups[0][1] === 4) return [7, groups[0][0], groups[1][0]];
    if (groups[0][1] === 3 && groups[1][1] === 2) return [6, groups[0][0], groups[1][0]];
    if (flush) return [5, ...sorted];
    if (straight) return [4, straight];
    if (groups[0][1] === 3) return [3, groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)];
    if (groups[0][1] === 2 && groups[1][1] === 2) {
      return [2, Math.max(groups[0][0], groups[1][0]), Math.min(groups[0][0], groups[1][0]), groups[2][0]];
    }
    if (groups[0][1] === 2) return [1, groups[0][0], ...groups.slice(1).map(([rank]) => rank).sort((a, b) => b - a)];
    return [0, ...sorted];
  }

  function evaluatePokerHand(hand) {
    if (hand.length !== 5) throw new Error("ポーカーの手札は5枚必要です");
    const natural = hand.filter((card) => !card.joker).map((card) => ({
      suit: card.suit,
      rank: card.number === 1 ? 15 : card.number
    }));
    const wildCount = 5 - natural.length;
    let best = null;

    function examine(cards, remaining) {
      if (remaining === 0) {
        const score = scoreNatural(cards);
        if (!best || compareScores(score, best) > 0) best = score;
        return;
      }
      wildOptions.forEach((option) => examine([...cards, option], remaining - 1));
    }

    examine(natural, wildCount);
    return { score: best, name: pokerNames[best[0]] };
  }

  function blackjackValue(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach((card) => {
      if (card.number === 1) {
        aces += 1;
        total += 1;
      } else {
        total += Math.min(card.number, 10);
      }
    });
    let soft = false;
    if (aces > 0 && total + 10 <= 21) {
      total += 10;
      soft = true;
    }
    return { total, soft };
  }

  globalThis.TAROT_GAME_RULES = Object.freeze({
    shuffle,
    compareScores,
    evaluatePokerHand,
    blackjackValue
  });
}());
