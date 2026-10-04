"""GitHub Pagesに渡す静的ファイルだけを_siteへ集める。"""

from __future__ import annotations

import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SITE = ROOT / "_site"
FILES = ("index.html", "credits.html", "styles.css", "image_sources.json")
DIRECTORIES = ("img", "js")


def main() -> None:
    records = json.loads((ROOT / "image_sources.json").read_text(encoding="utf-8"))["images"]
    missing_images = [item["local_file"] for item in records if not (ROOT / item["local_file"]).is_file()]
    if missing_images:
        raise FileNotFoundError(f"表示用画像がありません: {', '.join(missing_images)}")

    if SITE.exists():
        if SITE.is_symlink() or SITE.resolve().parent != ROOT:
            raise ValueError("公開用ディレクトリの場所を確認してください")
        shutil.rmtree(SITE)
    SITE.mkdir()
    for name in FILES:
        shutil.copy2(ROOT / name, SITE / name)
    for name in DIRECTORIES:
        shutil.copytree(ROOT / name, SITE / name)
    metadata_directory = SITE / "minor_arcana_images"
    metadata_directory.mkdir()
    shutil.copy2(
        ROOT / "minor_arcana_images/minor_arcana_sources.json",
        metadata_directory / "minor_arcana_sources.json",
    )
    print(f"GitHub Pages用ファイルを作成しました: {SITE}")


if __name__ == "__main__":
    main()
