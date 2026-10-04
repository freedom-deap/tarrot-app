"""保存済みの画像情報から、静的な出典一覧を作る。"""

from __future__ import annotations

import html
import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
MAJOR_NAMES = (
    ("Fool", "愚者"),
    ("Magician", "魔術師"),
    ("High_Priestess", "女教皇"),
    ("Empress", "女帝"),
    ("Emperor", "皇帝"),
    ("Hierophant", "法王"),
    ("Lovers", "恋人"),
    ("Chariot", "戦車"),
    ("Strength", "力"),
    ("Hermit", "隠者"),
    ("Wheel_of_Fortune", "運命の輪"),
    ("Justice", "正義"),
    ("Hanged_Man", "吊るされた男"),
    ("Death", "死神"),
    ("Temperance", "節制"),
    ("Devil", "悪魔"),
    ("Tower", "塔"),
    ("Star", "星"),
    ("Moon", "月"),
    ("Sun", "太陽"),
    ("Judgement", "審判"),
    ("World", "世界"),
)
SUITS = {
    "Wands": ("wands", "ワンド"),
    "Cups": ("cups", "カップ"),
    "Swords": ("swords", "ソード"),
    "Pents": ("pentacles", "ペンタクル"),
}
RANKS = ("エース", "2", "3", "4", "5", "6", "7", "8", "9", "10", "ペイジ", "ナイト", "クイーン", "キング")
COMMONS_FILE = "https://commons.wikimedia.org/wiki/File:"


def records() -> list[dict[str, str]]:
    result = []
    for number, (english, japanese) in enumerate(MAJOR_NAMES):
        filename = f"RWS_Tarot_{number:02d}_{english}.jpg"
        result.append({
            "group": "大アルカナ",
            "card": japanese,
            "local_file": f"img/{filename}",
            "source_file": filename,
            "source_page": COMMONS_FILE + quote(filename, safe="_"),
            "artist": "Pamela Colman Smith",
            "status": "パブリックドメイン（Commons上の表示）",
            "note": "Wikipediaから取得した縮小画像。取得時のファイル版は未記録。",
        })

    source = json.loads((ROOT / "minor_arcana_images/minor_arcana_sources.json").read_text(encoding="utf-8"))
    if source["card_count"] != 56 or len(source["cards"]) != 56:
        raise ValueError("小アルカナの出典記録が56件ではありません")
    for entry in source["cards"]:
        filename = entry["file_name"]
        suit_name = next((name for name in SUITS if filename.startswith(name)), None)
        if suit_name is None:
            raise ValueError(f"不明なスート: {filename}")
        number = int(filename[len(suit_name):len(suit_name) + 2])
        suit_id, japanese_suit = SUITS[suit_name]
        result.append({
            "group": "小アルカナ",
            "card": f"{japanese_suit}の{RANKS[number - 1]}",
            "local_file": f"img/{suit_id}_{number:02d}.jpg",
            "source_file": filename,
            "source_page": entry["commons_page"],
            "artist": entry["artist"],
            "status": "パブリックドメイン（Commons上の表示）" if entry["license"] == "Public domain" else entry["license"],
            "note": "Commonsから取得した画像と同一内容。表示用ファイル名に変更。",
        })

    result.append({
        "group": "カード裏面",
        "card": "白い裏面",
        "local_file": "img/card-back.svg",
        "source_file": "",
        "source_page": "",
        "artist": "このプロジェクトで作成",
        "status": "自作",
        "note": "白い長方形のSVG。外部画像は使用していません。",
    })
    return result


def table_rows(items: list[dict[str, str]]) -> str:
    rows = []
    for item in items:
        source = (
            f'<a href="{html.escape(item["source_page"], quote=True)}" rel="noopener noreferrer">'
            f'{html.escape(item["source_file"])}</a>'
            if item["source_page"] else "自作"
        )
        rows.append(
            "<tr>"
            f'<th scope="row">{html.escape(item["card"])}</th>'
            f'<td><code>{html.escape(item["local_file"])}</code></td>'
            f"<td>{source}</td>"
            f'<td>{html.escape(item["artist"])}</td>'
            f'<td>{html.escape(item["status"])}</td>'
            "</tr>"
        )
    return "\n".join(rows)


def build_page(items: list[dict[str, str]]) -> str:
    sections = []
    for group, heading in (("大アルカナ", "大アルカナ（22枚）"), ("小アルカナ", "小アルカナ（56枚）"), ("カード裏面", "カード裏面（1枚）")):
        group_items = [item for item in items if item["group"] == group]
        sections.append(f"""
      <section class="credits-section">
        <h2>{heading}</h2>
        <div class="table-scroll">
          <table>
            <thead><tr><th scope="col">カード</th><th scope="col">表示用ファイル</th><th scope="col">元のファイル・出典</th><th scope="col">作者</th><th scope="col">利用条件</th></tr></thead>
            <tbody>{table_rows(group_items)}</tbody>
          </table>
        </div>
      </section>""")
    return """<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Tarot Readingで使用する画像の出典と利用条件">
    <title>画像の出典・利用条件 | Tarot Reading</title>
    <link rel="stylesheet" href="./styles.css">
    <style>
      .credits-page { max-width: 1200px; margin: 0 auto; padding: 36px clamp(16px, 4vw, 48px) 64px; }
      .credits-page h1 { font-size: clamp(1.8rem, 4vw, 3rem); }
      .credits-page h2 { font-size: 1.35rem; font-weight: 400; }
      .credits-page p { font-family: system-ui, sans-serif; line-height: 1.8; }
      .credits-page a { color: var(--gold); text-underline-offset: .2em; }
      .credits-page a:hover, .credits-page a:focus-visible { color: var(--ink); }
      .credits-section { margin-top: 42px; }
      .table-scroll { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; font: .82rem/1.6 system-ui, sans-serif; }
      th, td { padding: 10px 12px; border-bottom: 1px solid rgba(213,178,109,.25); text-align: left; vertical-align: top; }
      thead th { color: var(--gold); white-space: nowrap; }
      tbody th { min-width: 7em; font-weight: 500; }
      code { font-size: .8rem; overflow-wrap: anywhere; }
    </style>
  </head>
  <body>
    <main class="credits-page">
      <p><a href="./index.html">← 占い画面に戻る</a></p>
      <h1>画像の出典・利用条件</h1>
      <p>このアプリで使用するカード表面78枚と裏面1枚の情報です。カード表面の作者は Pamela Colman Smith です。各リンク先の Wikimedia Commons ファイルページに、出典と利用条件の詳細があります。</p>
      <p>大アルカナはWikipediaから取得した縮小画像で、取得時のファイル版は記録されていません。小アルカナはCommonsから取得した画像と同一内容で、表示用にファイル名のみ変更しています。Commons上では各カード表面がパブリックドメインと表示されています。パブリックドメインの表示はライセンス名ではなく、各ファイルページの権利状態の説明です。</p>
      <p>記録データ：<a href="./image_sources.json">image_sources.json</a>。小アルカナの取得時情報：<a href="./minor_arcana_images/minor_arcana_sources.json">minor_arcana_sources.json</a>。</p>
""" + "\n".join(sections) + """
    </main>
  </body>
</html>
"""


def main() -> None:
    items = records()
    if len(items) != 79:
        raise ValueError(f"画像情報が79件ではありません: {len(items)}")
    missing = [item["local_file"] for item in items if not (ROOT / item["local_file"]).is_file()]
    if missing:
        raise FileNotFoundError(", ".join(missing))
    (ROOT / "image_sources.json").write_text(
        json.dumps({"source_checked_on": "2026-10-04", "images": items}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (ROOT / "credits.html").write_text(build_page(items), encoding="utf-8")


if __name__ == "__main__":
    main()
