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


def fetch_channel_videos(channel_id: str, api_key: str, max_results: int = 10) -> list:
    """
    指定したYouTubeチャンネルIDから動画一覧（videoId, title, publishedAt）を取得する
    """
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "key": api_key,
        "channelId": channel_id,
        "part": "snippet",
        "order": "date",
        "maxResults": max_results,
        "type": "video",
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    items = resp.json().get("items", [])
    videos = []
    for item in items:
        video_id = item["id"]["videoId"]
        snippet = item["snippet"]
        videos.append({
            "videoId": video_id,
            "title": snippet["title"],
            "publishedAt": snippet["publishedAt"],
        })
    return videos


def fetch_channel_videos_yt_dlp(channel_url: str, max_results: int = 10) -> list:
    """
    yt-dlpを使ってチャンネルの動画一覧（videoId, title, publishedAt）を取得する
    """
    import yt_dlp
    ydl_opts = {
        'extract_flat': True,
        'quiet': True,
        'skip_download': True,
    }
    videos = []
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(channel_url, download=False)
        # 'entries'に動画リストが入る
        for entry in info.get('entries', [])[:max_results]:
            videos.append({
                'videoId': entry.get('id'),
                'title': entry.get('title'),
                'publishedAt': entry.get('upload_date'),  # YYYYMMDD形式
            })
    return videos
