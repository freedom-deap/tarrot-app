"""小アルカナ取得処理の実行エントリーポイント。"""

from urllib.parse import urlsplit, urlunsplit

import get_minor_arcana as downloader


_get_commons_file_info = downloader.commons_file_info


def commons_file_info_without_tracking_query(file_name: str):
    """Commonsの原寸URLから取得に不要な分析用クエリを除去する。"""
    info = _get_commons_file_info(file_name)
    parts = urlsplit(str(info.get("url", "")))
    info["url"] = urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))
    return info


downloader.commons_file_info = commons_file_info_without_tracking_query


if __name__ == "__main__":
    raise SystemExit(downloader.main())
