"""Commons APIをバッチ照会して小アルカナ56枚を取得する。"""

import json
from urllib.parse import urlencode, urlsplit, urlunsplit

import get_minor_arcana as downloader


_file_info_cache = None


def load_all_file_info():
    """MediaWiki APIの上限に合わせ、56件を2リクエストで取得する。"""
    result = {}
    names = downloader.card_file_names()
    for start in range(0, len(names), 50):
        batch = names[start:start + 50]
        query = urlencode(
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "prop": "imageinfo",
                "titles": "|".join(f"File:{name}" for name in batch),
                "iiprop": "url|mime|size|extmetadata",
            }
        )
        body, content_type = downloader.fetch(
            f"{downloader.COMMONS_API}?{query}", "application/json"
        )
        if content_type != "application/json":
            raise downloader.DownloadError("Commons API応答がJSONではありません")
        payload = json.loads(body.decode("utf-8"))
        for page in payload.get("query", {}).get("pages", []):
            image_info = page.get("imageinfo", [])
            if page.get("missing") or not image_info:
                continue
            info = image_info[0]
            parts = urlsplit(str(info.get("url", "")))
            info["url"] = urlunsplit(
                (parts.scheme, parts.netloc, parts.path, "", "")
            )
            title = str(page.get("title", ""))
            result[title.removeprefix("File:")] = info
    return result


def batched_file_info(file_name):
    global _file_info_cache
    if _file_info_cache is None:
        _file_info_cache = load_all_file_info()
    if file_name not in _file_info_cache:
        raise downloader.DownloadError(
            f"Commonsから画像情報を取得できませんでした: {file_name}"
        )
    return _file_info_cache[file_name]


downloader.commons_file_info = batched_file_info


if __name__ == "__main__":
    raise SystemExit(downloader.main())
