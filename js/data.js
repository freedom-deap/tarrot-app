(function () {
  "use strict";

  const IMAGE_DIRECTORY = "./img";
  const cardBack = `${IMAGE_DIRECTORY}/card-back.svg`;

  const majorNames = [
    ["Fool", "愚者", ["何も考えない", "気まぐれ", "無邪気さ", "楽観視・自由"], ["ルーズな行動", "先が見えない", "愚かさ", "無計画・軽はずみ"]],
    ["Magician", "魔術師", ["何かが始まる", "独創性", "挑戦する自信がある", "自分一人の力"], ["自信を無くす", "消極的になる", "スタートで失敗", "未熟さ・中途半端"]],
    ["High_Priestess", "女教皇", ["知性的・常識的", "物静か", "感情を抑える", "新しい知識と情報"], ["ヒステリック", "冷たさ・批判的精神", "無神経さ", "行動力が無い"]],
    ["Empress", "女帝", ["豊かさ", "物質的な幸福感", "優雅な生活", "母性的・繁栄"], ["わがまま", "欲望が尽きない・浪費癖", "見栄っ張り", "気の迷い"]],
    ["Emperor", "皇帝", ["権力を握る", "責任感・リーダー", "父性", "実行力"], ["ワンマン・無責任", "傲慢さ", "計画通りにいかない", "他人を見下す"]],
    ["Hierophant", "法王", ["信頼・親切", "慈悲深い心", "良いアドバイス", "問題解決能力"], ["心の狭さ・ケチ", "信用を無くす", "押しつけがましい", "孤立無援"]],
    ["Lovers", "恋人", ["恋を楽しむ・楽しいひと時", "心がときめく", "レジャー運アップ", "魅力が磨かれる"], ["恋が終わる・心が離れる", "中途半端で飽きてしまう", "その場限りの快楽", "いい加減になる"]],
    ["Chariot", "戦車", ["スピーディー", "前進", "ハッキリとした結果が出る", "勝負に勝つ"], ["暴走", "ストップ", "空回りしてしまう", "無気力になる"]],
    ["Strength", "力", ["強い意志を持つ", "目標に向かって頑張る", "エネルギーに溢れている", "困難に打ち勝つ"], ["自信喪失", "落ち込む", "脱力感", "大失敗"]],
    ["Hermit", "隠者", ["一人で深く考える", "内省", "ひっそりとした静けさ", "大きな動きが無い"], ["他人を避ける", "ネガティブ思考", "疑い深い", "思慮分別が無い"]],
    ["Wheel_of_Fortune", "運命の輪", ["チャンスが来る", "状況が大きく好転する", "ナイスタイミング", "上がり目"], ["タイミングを逃す", "間が悪い", "状況が急に悪くなる", "下がり目"]],
    ["Justice", "正義", ["公平で公正な判断", "真面目", "安定した状況", "計画通りに進む"], ["偏見", "不真面目", "アンバランス", "優柔不断"]],
    ["Hanged_Man", "吊るされた男", ["試練の時", "身動きが取れない状況", "苦労することで成功", "犠牲"], ["報われない努力", "徒労", "無駄な犠牲", "動くことでかえって失敗"]],
    ["Death", "死神", ["絶望", "終わり", "中止", "失敗"], ["生まれ変わる", "新しく始まる", "不調から抜け出す", "イメージチェンジ"]],
    ["Temperance", "節制", ["予定通り", "調和", "穏やかに進む", "純粋"], ["物事の停滞", "マンネリ", "怠惰", "不純"]],
    ["Devil", "悪魔", ["誘惑に負ける", "束縛", "悪だくみ", "重苦しい気持ち"], ["解き放たれる", "現状打破", "縁が切れる", "欲を捨てる"]],
    ["Tower", "塔", ["破局", "ショックを受ける出来事", "逆境・ネガティブ", "心が折れる"], ["緊張状態が続く", "破滅寸前", "揉め事に巻き込まれる", "混乱状況"]],
    ["Star", "星", ["願いはかなう", "理想", "希望に溢れた未来", "ロマンチスト"], ["幻滅", "悲観する", "願いが叶わない", "がっかりする出来事"]],
    ["Moon", "月", ["不安", "モヤモヤした状況", "誤解を受ける", "迷い・嘘"], ["スッキリする", "誤解が解ける", "状況が良くなる", "時間が解決してくれる"]],
    ["Sun", "太陽", ["明るさ", "バイタリティー溢れる", "名声を手に入れる", "楽しい気分"], ["暗さ", "悲観的", "挫折する", "エネルギー不足"]],
    ["Judgement", "審判", ["復活", "良い知らせ", "運が開ける", "決断"], ["再チャレンジでも失敗", "悪い知らせ", "罰が当たる", "無くなってしまう"]],
    ["World", "世界", ["完成", "計画が成功する", "目標に到達する", "幸福感・理想的な人"], ["未完成", "不完全燃焼", "平凡さ・未熟", "目立った動きが無い"]]
  ];

  // 意味文は meanings の文字列を差し替えて追加する。
  const majorCards = majorNames.map(([fileName, name, upright, reversed], number) => ({
    id: `major-${String(number).padStart(2, "0")}`,
    arcana: "major",
    number,
    name,
    image: `${IMAGE_DIRECTORY}/RWS_Tarot_${String(number).padStart(2, "0")}_${fileName}.jpg`,
    meanings: {
      upright,
      reversed
    }
  }));

  const minorSuits = [
    { id: "wands", name: "ワンド", meanings: { upright: ["", "", "", ""], reversed: ["", "", "", ""] } },
    { id: "cups", name: "カップ", meanings: { upright: ["", "", "", ""], reversed: ["", "", "", ""] } },
    { id: "swords", name: "ソード", meanings: { upright: ["", "", "", ""], reversed: ["", "", "", ""] } },
    { id: "pentacles", name: "ペンタクル", meanings: { upright: ["", "", "", ""], reversed: ["", "", "", ""] } }
  ];

  const minorRanks = [
    "エース", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "ペイジ", "ナイト", "クイーン", "キング"
  ].map((name, index) => ({
    number: index + 1,
    name,
    meanings: {
      upright: ["", "", "", ""],
      reversed: ["", "", "", ""]
    }
  }));

  const minorCards = minorSuits.flatMap((suit) => (
    minorRanks.map((rank) => {
      const number = rank.number;
      const paddedNumber = String(number).padStart(2, "0");
      return {
        id: `minor-${suit.id}-${paddedNumber}`,
        arcana: "minor",
        suit: suit.id,
        number,
        rank: rank.name,
        name: `${suit.name}の${rank.name}`,
        image: `${IMAGE_DIRECTORY}/${suit.id}_${paddedNumber}.jpg`,
        meanings: {
          upright: {
            suit: suit.meanings.upright,
            rank: rank.meanings.upright
          },
          reversed: {
            suit: suit.meanings.reversed,
            rank: rank.meanings.reversed
          }
        }
      };
    })
  ));

  const cards = [...majorCards, ...minorCards];

  const spreads = [
    {
      id: "one-card",
      name: "ワンカード",
      description: "今の自分に必要なメッセージを一枚から読み取ります。",
      positions: [
        { id: "message", label: "今へのメッセージ", meaning: "現在のあなたに向けた示唆を表す位置です。", x: 50, y: 46 }
      ]
    },
    {
      id: "three-card",
      name: "スリーカード",
      description: "過去・現在・未来の流れを三枚から読み取ります。",
      positions: [
        { id: "past", label: "過去", meaning: "現在に影響を与えている過去の出来事や背景を表します。", x: 25, y: 46 },
        { id: "present", label: "現在", meaning: "今置かれている状況や、向き合うべきテーマを表します。", x: 50, y: 46 },
        { id: "future", label: "未来", meaning: "現在の流れが続いた先にある可能性を表します。", x: 75, y: 46 }
      ]
    },
    {
      id: "choice",
      name: "二者択一",
      description: "二つの選択肢がもたらす過程と結果を五枚で比べます。",
      positions: [
        { id: "present", label: "現在", meaning: "判断の起点となる現在の状況を表します。", x: 50, y: 50 },
        { id: "a-process", label: "選択肢A・過程", meaning: "選択肢Aを選んだ場合の過程を表します。", x: 28, y: 34 },
        { id: "a-result", label: "選択肢A・結果", meaning: "選択肢Aを選んだ先の可能性を表します。", x: 20, y: 67 },
        { id: "b-process", label: "選択肢B・過程", meaning: "選択肢Bを選んだ場合の過程を表します。", x: 72, y: 34 },
        { id: "b-result", label: "選択肢B・結果", meaning: "選択肢Bを選んだ先の可能性を表します。", x: 80, y: 67 }
      ]
    }
  ];

  window.TAROT_DATA = Object.freeze({ cardBack, cards, spreads });
}());
