import requests


def fetch_youtube_title(youtube_url: str) -> str:
    """
    YouTubeのoEmbed APIを使って動画タイトルを取得する
    """
    oembed_url = f"https://www.youtube.com/oembed?url={youtube_url}&format=json"
    resp = requests.get(oembed_url)
    resp.raise_for_status()
    data = resp.json()
    return data.get("title", "")


def extract_video_id(youtube_url: str) -> str:
    """
    YouTube URLからvideoIdを抽出する
    """
    import re

    # 標準的なYouTube URLパターン
    patterns = [
        r"youtu\.be/([\w-]{11})",
        r"youtube\.com/watch\?v=([\w-]{11})",
        r"youtube\.com/embed/([\w-]{11})",
        r"youtube\.com/v/([\w-]{11})",
    ]
    for pat in patterns:
        m = re.search(pat, youtube_url)
        if m:
            return m.group(1)
    return ""
