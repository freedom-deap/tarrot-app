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
    { id: "wands", name: "ワンド", meaning: "人の情熱や感情、意志、想像力" },
    { id: "cups", name: "カップ", meaning: "恋愛感情、愛に関すること" },
    { id: "swords", name: "ソード", meaning: "理性や知恵、情報" },
    { id: "pentacles", name: "ペンタクル", meaning: "お金やモノ、目に見えるものや仕事、安定性" }
  ];

  const minorRanks = [
    { number: 1, name: "エース", meaning: "スートの力が最も強い" },
    { number: 2, name: "2", meaning: "スートの力が最も弱い" },
    { number: 3, name: "3", meaning: "2よりは強いがまだ弱い" },
    { number: 4, name: "4", meaning: "スートの力が安定している" },
    { number: 5, name: "5", meaning: "スートの力の安定が崩れ激しく変化している" },
    { number: 6, name: "6", meaning: "全体として調和がとれた状態" },
    { number: 7, name: "7", meaning: "不安定さが強く出ている" },
    { number: 8, name: "8", meaning: "突然の変化" },
    { number: 9, name: "9", meaning: "スートの力が完成される一歩手前" },
    { number: 10, name: "10", meaning: "スートの力が完成された状態" },
    { number: 11, name: "ペイジ", meaning: "幼い子供、発展途上、伝達者" },
    { number: 12, name: "ナイト", meaning: "若い男性、行動力、能動" },
    { number: 13, name: "クイーン", meaning: "女性性、感情的、受け身" },
    { number: 14, name: "キング", meaning: "権力者、年長者、実力、権威、責任" }
  ];

  // 各カードの正位置・逆位置に、それぞれ3つの意味を個別に記入する。
  const minorCardMeanings = {
    "minor-wands-01": { upright: ["誕生", "強い情熱", "体力と気力が充実"], reversed: ["物事の終了", "間違ったスタート", "意欲が湧かない"] },
    "minor-wands-02": { upright: ["犠牲", "野心", "社会的・経済的な成功"], reversed: ["不測の事態", "計画の見直し", "イメージチェンジ"] },
    "minor-wands-03": { upright: ["将来への期待感", "発展", "物事が良くなる兆し"], reversed: ["将来への期待感", "発展", "物事が良くなる兆し"] },
    "minor-wands-04": { upright: ["平和", "穏やかなムード", "楽しいイベント"], reversed: ["平和", "穏やかなムード", "楽しいイベント"] },
    "minor-wands-05": { upright: ["ライバル争い", "終わりが見えない", "やることが多い"], reversed: ["さらに混乱した状態", "不毛な争い", "複雑"] },
    "minor-wands-06": { upright: ["プライドが満たされる", "勝利", "成果を得る"], reversed: ["敗北", "屈辱感", "相手の言いなりになる"] },
    "minor-wands-07": { upright: ["有利な立場に立つ", "逃げずに戦う", "好成績"], reversed: ["不利な状況", "優柔不断", "やる気が無い"] },
    "minor-wands-08": { upright: ["目まぐるしく状況が変わる", "一気に進む", "スピーディー"], reversed: ["停滞", "ゆっくりとした流れ", "嫉妬心"] },
    "minor-wands-09": { upright: ["身長", "準備を怠らない", "強い警戒心"], reversed: ["大幅に遅れる", "腰が重い", "閉塞感"] },
    "minor-wands-10": { upright: ["重圧感", "抑圧", "重い負担がのしかかる"], reversed: ["", "", ""] },
    "minor-wands-11": { upright: ["良い知らせ", "アドバイス", "コミュニケーション"], reversed: ["悪い知らせ", "デマに悩まされる", "情報不足"] },
    "minor-wands-12": { upright: ["出発", "前進", "移動"], reversed: ["自分から距離を取る", "急な中断", "動揺"] },
    "minor-wands-13": { upright: ["エネルギッシュな女性", "明るく楽しい環境", "情熱"], reversed: ["わがままな女王様", "強欲", "嫉妬心"] },
    "minor-wands-14": { upright: ["未来を切り開く", "リーダーシップ", "精力的"], reversed: ["ワンマンな態度", "行動が空回り", "空気を読まない"] },
    "minor-cups-01": { upright: ["ロマンチックな感情", "幸福感", "人の温かさ"], reversed: ["傷心の出来事", "願いが叶わない", "失恋"] },
    "minor-cups-02": { upright: ["心ときめく楽しい出来事", "ロマンス", "パートナーシップ"], reversed: ["愛が離れていく", "意見が合わない", "分裂"] },
    "minor-cups-03": { upright: ["楽しいひと時", "ハイテンション", "軽いノリ"], reversed: ["遊びすぎ", "集中できない", "妊娠"] },
    "minor-cups-04": { upright: ["倦怠感", "現状に飽きる", "マンネリ"], reversed: ["新たな展開", "新鮮さ", "動きが軽い"] },
    "minor-cups-05": { upright: ["半分以上が無くなる", "過去にこだわる", "失意"], reversed: ["かすかな希望", "再会", "祖先"] },
    "minor-cups-06": { upright: ["過去からの影響", "思い出", "郷愁"], reversed: ["明日を見る行動", "気分一新", "過去の記憶を払拭"] },
    "minor-cups-07": { upright: ["空想", "曖昧な状況", "迷い"], reversed: ["クリアな思考", "正しい判断", "具体的な行動"] },
    "minor-cups-08": { upright: ["捨て去る", "断念", "新たな道を進む"], reversed: ["喜び", "嬉しい出来事", "やり遂げる"] },
    "minor-cups-09": { upright: ["豊かさ", "願いが叶う", "満足感"], reversed: ["贅沢間", "過剰", "不満が募る"] },
    "minor-cups-10": { upright: ["平和", "家族愛", "アットホームな雰囲気"], reversed: ["平和が崩れる", "家庭内不和", "孤独感"] },
    "minor-cups-11": { upright: ["純粋無垢", "ロマンチスト", "誰かに甘える"], reversed: ["幼さが出る", "感情だけの行動", "依存心"] },
    "minor-cups-12": { upright: ["ロマンチックな出来事", "プロポーズ", "援助を受ける"], reversed: ["甘い言葉に惑わされる", "嘘", "邪な考え"] },
    "minor-cups-13": { upright: ["献身的な愛情", "母性", "女性としての魅力が高まる"], reversed: ["ヒステリック", "不名誉", "女性に振り回される"] },
    "minor-cups-14": { upright: ["人情味あふれる", "寛大な心", "親切心"], reversed: ["不正行為", "スキャンダルに巻き込まれる", "嘘つきな男性"] },
    "minor-swords-01": { upright: ["合理的な判断", "力づくで勝利", "権利"], reversed: ["残忍さ", "攻撃的な態度", "敗北感"] },
    "minor-swords-02": { upright: ["バランスがとれる", "友情", "要領が良い"], reversed: ["不安定", "優柔不断", "不誠実"] },
    "minor-swords-03": { upright: ["深い悲しみ", "涙", "ネガティブ"], reversed: ["情緒不安定", "予想外の出来事", "突然の悪化"] },
    "minor-swords-04": { upright: ["一時的な休息", "一旦停止", "問題から離れる"], reversed: ["徐々に動き出す", "低迷状態からの脱出", "回復傾向"] },
    "minor-swords-05": { upright: ["手段を択ばずに勝利", "利己心", "残酷さ"], reversed: ["敗北", "屈辱感", "不穏なムード"] },
    "minor-swords-06": { upright: ["援助を受ける", "安全な方向へ逃げる", "明るい見通し"], reversed: ["逃げられない状況", "行き詰まり", "離れる"] },
    "minor-swords-07": { upright: ["狡猾な行動", "計算づくめ", "策略"], reversed: ["アドバイス", "誠実さ", "知性"] },
    "minor-swords-08": { upright: ["束縛", "忍耐力", "じっとして動かない"], reversed: ["物事のさらなる悪化", "事故", "困難に立ち往生"] },
    "minor-swords-09": { upright: ["激しく苦悩する", "終わらない悲しみ", "絶望感"], reversed: ["ゴシップ", "疑心暗鬼", "被害者意識"] },
    "minor-swords-10": { upright: ["希望が無くなる", "幕引き", "最悪な結末"], reversed: ["一時的に好転", "ほのかな希望", "予期せぬ幸運"] },
    "minor-swords-11": { upright: ["警戒心", "連絡を受ける", "貴重な情報"], reversed: ["スパイ行為", "きつい言い方", "好戦的"] },
    "minor-swords-12": { upright: ["突進", "恐れ知らず", "感情を捨て去る"], reversed: ["軽率な行動", "威嚇", "盲目的"] },
    "minor-swords-13": { upright: ["クールビューティー", "合理的な行動", "未亡人"], reversed: ["批判的態度", "冷たい言動", "意固地"] },
    "minor-swords-14": { upright: ["絶対的な権力者", "指導力", "裁判"], reversed: ["サディスト", "情け容赦のない態度", "恨みを買う"] },
    "minor-pentacles-01": { upright: ["大金を得る", "宝物", "自分にとって価値あるもの"], reversed: ["大金を失う", "経済的な損害", "喪失感"] },
    "minor-pentacles-02": { upright: ["気晴らし", "身近なレジャー", "同時進行"], reversed: ["真剣さに書ける", "無意味な行動", "暴飲暴食"] },
    "minor-pentacles-03": { upright: ["修行", "努力を重ねる", "真面目"], reversed: ["平凡さ", "不真面目", "怠け癖"] },
    "minor-pentacles-04": { upright: ["物への執着心", "手放さない", "ため込みすぎる"], reversed: ["強欲", "状況の膠着状態", "改善が進まない"] },
    "minor-pentacles-05": { upright: ["貧乏", "愛情に恵まれない", "夢も希望も無い"], reversed: ["見通しが立たない", "混乱状態", "メリットが無い"] },
    "minor-pentacles-06": { upright: ["ボランティア", "親切心", "慈善活動"], reversed: ["自分本位", "ケチ", "情が無い"] },
    "minor-pentacles-07": { upright: ["成長を見守る", "進展が遅い", "待ち続ける"], reversed: ["待ちきれない", "途中で投げ出す", "面倒くさがり"] },
    "minor-pentacles-08": { upright: ["勤勉", "ノルマ達成", "規則正しい生活"], reversed: ["見栄を張る", "手抜き", "偽物"] },
    "minor-pentacles-09": { upright: ["安心安全な立場", "寵愛", "愛される女性"], reversed: ["不誠実", "媚びを植える", "色気"] },
    "minor-pentacles-10": { upright: ["アットホームな状況", "家族", "和気藹々"], reversed: ["気が緩む", "家族のトラブル", "いい加減な対応"] },
    "minor-pentacles-11": { upright: ["勤勉さ", "専門知識", "お金に関する良い知らせ"], reversed: ["さぼる", "不勉強", "お金に関する悪い知らせ"] },
    "minor-pentacles-12": { upright: ["確実な歩み", "安定性", "現実的な行動"], reversed: ["停滞", "マンネリ感", "新鮮味が無い"] },
    "minor-pentacles-13": { upright: ["保守的な女性", "金銭的な援助", "思考に耽る"], reversed: ["退屈な状況", "動きが無い", "浪費傾向"] },
    "minor-pentacles-14": { upright: ["経済的にも安定した生活", "社会的地位の高い人物", "現実的な思考"], reversed: ["お金儲けに勤しむ", "不正行為", "変化が無い"] }
  };

  const minorCards = minorSuits.flatMap((suit) => (
    minorRanks.map((rank) => {
      const number = rank.number;
      const paddedNumber = String(number).padStart(2, "0");
      const id = `minor-${suit.id}-${paddedNumber}`;
      return {
        id,
        arcana: "minor",
        suit: suit.id,
        number,
        rank: rank.name,
        name: `${suit.name}の${rank.name}`,
        image: `${IMAGE_DIRECTORY}/${suit.id}_${paddedNumber}.jpg`,
        meanings: minorCardMeanings[id],
        supplement: {
          suit: { name: suit.name, meaning: suit.meaning },
          rank: { name: rank.name, meaning: rank.meaning }
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
