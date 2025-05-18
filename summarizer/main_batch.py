import os
import time
import logging
from summarizer.text_summarizer import summarize_text, extract_tags, generate_excerpt
from summarizer.youtube_utils import fetch_youtube_title, extract_video_id
import yaml
import datetime
from summarizer.youtube_utils import fetch_channel_videos_yt_dlp
from summarizer.youtube_summarizer import summarize_youtube_url

# 設定
CHANNEL_URLS = [
    # チャンネルのURLを追加（例: https://www.youtube.com/c/GoogleDevelopers）
    # "https://www.youtube.com/c/GoogleDevelopers",
    "https://www.youtube.com/@%E3%82%B7%E3%82%A3%E3%83%BC%E3%83%A9%E3%81%A1%E3%82%83%E3%82%93%E3%81%AD%E3%82%8B",
]
OUTPUT_DIR = "output"
INTERVAL_SEC = 60 * 60 * 6  # 6時間ごと
MAX_RESULTS = 5

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main_batch")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "temp"))
    os.makedirs(temp_dir, exist_ok=True)
    processed_ids = set()
    while True:
        for channel_url in CHANNEL_URLS:
            logger.info(f"チャンネル {channel_url} の動画一覧を取得")
            try:
                videos = fetch_channel_videos_yt_dlp(
                    channel_url, max_results=MAX_RESULTS
                )
            except Exception as e:
                logger.error(f"動画一覧取得失敗: {e}")
                continue
            for video in videos:
                vid = video["videoId"]
                if not vid or vid in processed_ids:
                    continue
                url = f"https://www.youtube.com/watch?v={vid}"
                logger.info(f"動画要約開始: {url}")
                try:
                    raw_text = summarize_youtube_url(url)
                    result = summarize_text(raw_text)
                    video_id = vid
                    base = f"youtube_{video_id}"
                    output_path = os.path.join(OUTPUT_DIR, base + ".mdx")
                    raw_path = os.path.join(temp_dir, base + "_raw.txt")

                    # frontmatter自動生成
                    title = fetch_youtube_title(url)
                    tags = extract_tags(result, logger, max_tags=3)
                    excerpt = generate_excerpt(result, logger)
                    published_at = datetime.datetime.now().isoformat()
                    frontmatter = {
                        "title": title,
                        "excerpt": excerpt,
                        "videoId": video_id,
                        "videoUrl": url,
                        "publishedAt": published_at,
                        "tags": tags,
                    }
                    yaml_frontmatter = yaml.dump(
                        frontmatter, allow_unicode=True, sort_keys=False
                    )
                    cleaned_result = result.strip()
                    if cleaned_result.startswith("```markdown"):
                        cleaned_result = cleaned_result[len("```markdown") :].lstrip(
                            "\n"
                        )
                    if cleaned_result.endswith("```"):
                        cleaned_result = cleaned_result[:-3].rstrip("\n")
                    markdown = f"---\n{yaml_frontmatter}---\n\n{cleaned_result}\n"
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(markdown)
                    with open(raw_path, "w", encoding="utf-8") as f:
                        f.write(raw_text)
                    logger.info(f"Summary written to: {output_path}")
                    logger.info(f"Raw transcription written to: {raw_path}")
                    processed_ids.add(vid)
                except Exception as e:
                    logger.error(f"要約失敗: {e}")
        logger.info(f"{INTERVAL_SEC}秒スリープ...")
        time.sleep(INTERVAL_SEC)


if __name__ == "__main__":
    main()
