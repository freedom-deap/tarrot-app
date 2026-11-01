const test = require("node:test");
const assert = require("node:assert/strict");

require("../js/game-rules.js");
const rules = globalThis.TAROT_GAME_RULES;

function card(suit, number) {
  return { suit, number };
}

test("ポーカーは同じ役をランクで比較する", () => {
  const highPair = rules.evaluatePokerHand([
    card("wands", 14), card("cups", 14), card("swords", 2),
    card("cups", 4), card("pentacles", 7)
  ]);
  const lowPair = rules.evaluatePokerHand([
    card("wands", 13), card("cups", 13), card("swords", 2),
    card("cups", 4), card("pentacles", 7)
  ]);
  assert.equal(highPair.name, "ワンペア");
  assert.equal(rules.compareScores(highPair.score, lowPair.score), 1);
});

test("エースはストレートの低位と高位で使える", () => {
  const low = rules.evaluatePokerHand([
    card("wands", 1), card("cups", 2), card("swords", 3),
    card("cups", 4), card("pentacles", 5)
  ]);
  const high = rules.evaluatePokerHand([
    card("wands", 11), card("cups", 12), card("swords", 13),
    card("cups", 14), card("pentacles", 1)
  ]);
  assert.equal(low.name, "ストレート");
  assert.equal(high.name, "ストレート");
  assert.equal(rules.compareScores(high.score, low.score), 1);
});

test("大アルカナのジョーカー2枚でファイブカードを作れる", () => {
  const result = rules.evaluatePokerHand([
    card("wands", 9), card("cups", 9), card("swords", 9),
    { joker: true }, { joker: true }
  ]);
  assert.equal(result.name, "ファイブカード");
});

test("同じランクのフラッシュよりストレートフラッシュが強い", () => {
  const flush = rules.evaluatePokerHand([
    card("wands", 2), card("wands", 4), card("wands", 7),
    card("wands", 9), card("wands", 11)
  ]);
  const straightFlush = rules.evaluatePokerHand([
    card("cups", 2), card("cups", 3), card("cups", 4),
    card("cups", 5), card("cups", 6)
  ]);
  assert.equal(rules.compareScores(straightFlush.score, flush.score), 1);
});

test("ブラックジャックのエースはバーストしない値を選ぶ", () => {
  assert.deepEqual(rules.blackjackValue([card("wands", 1), card("cups", 9)]), { total: 20, soft: true });
  assert.deepEqual(rules.blackjackValue([card("wands", 1), card("cups", 9), card("swords", 5)]), { total: 15, soft: false });
  assert.deepEqual(rules.blackjackValue([card("wands", 1), card("cups", 1), card("swords", 9)]), { total: 21, soft: true });
  assert.equal(rules.blackjackValue([card("wands", 11), card("cups", 12), card("swords", 13)]).total, 30);
});
