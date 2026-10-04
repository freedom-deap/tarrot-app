"""Wikimedia Commonsから小アルカナ56枚の原寸画像を取得する。"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "tarot-app-image-downloader/1.0 (educational project)"
SUITS = ("Wands", "Cups", "Swords", "Pents")
CARDS_PER_SUIT = 14
EXPECTED_COUNT = 56
DEFAULT_OUTPUT = Path(__file__).resolve().parent / "img"
MAX_ATTEMPTS = 4
TIMEOUT_SECONDS = 30


class DownloadError(RuntimeError):
    """画像取得または検証に失敗したことを表す。"""


def card_file_names() -> list[str]:
    return [
        f"{suit}{number:02d}.jpg"
        for suit in SUITS
        for number in range(1, CARDS_PER_SUIT + 1)
    ]


def fetch(url: str, accept: str) -> tuple[bytes, str]:
    """タイムアウトと回数制限付きでURLを取得する。"""
    last_error: Exception | None = None
    for attempt in range(1, MAX_ATTEMPTS + 1):
        request = Request(
            url,
            headers={"User-Agent": USER_AGENT, "Accept": accept},
        )
        try:
            with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                return response.read(), response.headers.get_content_type()
        except HTTPError as error:
            last_error = error
            if error.code < 500 and error.code != 429:
                break
        except (URLError, TimeoutError, OSError) as error:
            last_error = error
        if attempt < MAX_ATTEMPTS:
            time.sleep(2 ** (attempt - 1))
    raise DownloadError(f"取得に失敗しました: {url}") from last_error


def commons_file_info(file_name: str) -> dict[str, Any]:
    """Commons APIから原寸URL、寸法、ライセンス情報を取得する。"""
    query = urlencode(
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "imageinfo",
            "titles": f"File:{file_name}",
            "iiprop": "url|mime|size|extmetadata",
        }
    )
    body, content_type = fetch(f"{COMMONS_API}?{query}", "application/json")
    if content_type != "application/json":
        raise DownloadError(f"API応答がJSONではありません: {file_name}")
    payload = json.loads(body.decode("utf-8"))
    pages = payload.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        raise DownloadError(f"Commonsにファイルがありません: {file_name}")
    image_info = pages[0].get("imageinfo", [])
    if not image_info:
        raise DownloadError(f"画像情報がありません: {file_name}")
    info = image_info[0]
    if not str(info.get("mime", "")).startswith("image/"):
        raise DownloadError(f"画像ファイルではありません: {file_name}")
    return info


def plain_text(value: Any) -> str:
    if isinstance(value, dict):
        value = value.get("value", "")
    return re.sub(r"<[^>]+>", "", html.unescape(str(value))).strip()


def attribution(file_name: str, info: dict[str, Any]) -> dict[str, Any]:
    metadata = info.get("extmetadata", {})
    return {
        "file_name": file_name,
        "commons_page": info.get("descriptionurl", ""),
        "original_url": info.get("url", ""),
        "width": info.get("width"),
        "height": info.get("height"),
        "mime": info.get("mime", ""),
        "artist": plain_text(metadata.get("Artist", "")),
        "credit": plain_text(metadata.get("Credit", "")),
        "license": plain_text(metadata.get("LicenseShortName", "")),
        "license_url": plain_text(metadata.get("LicenseUrl", "")),
        "attribution_required": plain_text(
            metadata.get("AttributionRequired", "")
        ),
    }


def download_card(
    file_name: str,
    info: dict[str, Any],
    output: Path,
    overwrite: bool,
) -> str:
    """画像を一時ファイル経由で安全に保存する。"""
    destination = output / file_name
    if destination.exists() and not overwrite:
        return "skip"
    image_url = str(info.get("url", ""))
    if not image_url:
        raise DownloadError(f"原寸URLがありません: {file_name}")
    body, content_type = fetch(image_url, "image/*")
    if content_type not in {"image/jpeg", "image/pjpeg"} or not body:
        raise DownloadError(f"JPEGを取得できません: {file_name} ({content_type})")
    temporary = destination.with_suffix(destination.suffix + ".part")
    try:
        temporary.write_bytes(body)
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)
    return "download"


def verify(output: Path, names: list[str]) -> None:
    missing = [
        name for name in names
        if not (output / name).is_file() or (output / name).stat().st_size == 0
    ]
    if missing:
        raise DownloadError(
            f"{len(names) - len(missing)}/{len(names)}枚のみ取得済みです。"
            f"不足: {', '.join(missing)}"
        )


def save_attribution(output: Path, records: list[dict[str, Any]]) -> Path:
    destination = output / "minor_arcana_sources.json"
    temporary = destination.with_suffix(destination.suffix + ".part")
    payload = {
        "source": "Wikimedia Commons",
        "commons_api": COMMONS_API,
        "card_count": len(records),
        "cards": records,
    }
    try:
        temporary.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)
    return destination


def download_minor_arcana(output: Path, overwrite: bool, delay: float) -> None:
    output.mkdir(parents=True, exist_ok=True)
    names = card_file_names()
    records: list[dict[str, Any]] = []
    for index, file_name in enumerate(names, start=1):
        info = commons_file_info(file_name)
        result = download_card(file_name, info, output, overwrite)
        records.append(attribution(file_name, info))
        print(f"[{index:02d}/{EXPECTED_COUNT}] {result:8s} {file_name}")
        if delay and index < len(names):
            time.sleep(delay)
    verify(output, names)
    metadata_path = save_attribution(output, records)
    print(f"完了: 小アルカナ{EXPECTED_COUNT}枚")
    print(f"出典・ライセンス情報: {metadata_path}")


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Wikimedia Commonsから小アルカナ56枚を取得します。"
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--delay", type=float, default=0.1)
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    if arguments.delay < 0:
        raise SystemExit("--delayには0以上を指定してください")
    try:
        download_minor_arcana(
            arguments.output.resolve(), arguments.overwrite, arguments.delay
        )
    except (DownloadError, json.JSONDecodeError) as error:
        print(f"エラー: {error}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
