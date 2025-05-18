import argparse
import os
import sys
import datetime
from summarizer.text_summarizer import (
    summarize_text,
    summarize_text_file,
    extract_tags,
    generate_excerpt,
)
from summarizer.youtube_summarizer import summarize_youtube_url, logger
from summarizer.youtube_utils import fetch_youtube_title, extract_video_id
import yaml


def is_youtube_url(input_str: str) -> bool:
    logger.debug(f"is_youtube_url called with: {input_str}")
    return input_str.startswith("http://") or input_str.startswith("https://")


def main():
    parser = argparse.ArgumentParser(
        description="テキストまたはYouTube動画を要約するツール"
    )
    parser.add_argument(
        "-i", "--input", required=True, help="テキストファイルのパスまたはYouTubeのURL"
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default="output",
        help="出力先ディレクトリ（デフォルト: output/）",
    )
    args = parser.parse_args()
    logger.info(f"main started with input: {args.input}")

    os.makedirs(args.output_dir, exist_ok=True)
    output_path = None
    raw_path = None

    if is_youtube_url(args.input):
        try:
            logger.info("YouTube動画の文字起こしを開始します...")
            raw_text = summarize_youtube_url(args.input)
            logger.info(
                "YouTube動画の文字起こしが完了しました。要約処理を開始します..."
            )
            result = summarize_text(raw_text)
            logger.info(
                "YouTube動画の要約が完了しました。frontmatter生成を開始します..."
            )
            # ファイル名生成
            video_id = extract_video_id(args.input)
            base = f"youtube_{video_id}"
            output_path = os.path.join(args.output_dir, base + ".mdx")
            temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "temp"))
            os.makedirs(temp_dir, exist_ok=True)
            raw_path = os.path.join(temp_dir, base + "_raw.txt")

            # frontmatter自動生成
            title = fetch_youtube_title(args.input)
            tags = extract_tags(result, logger, max_tags=3)
            excerpt = generate_excerpt(result, logger)
            published_at = datetime.datetime.now().isoformat()
            frontmatter = {
                "title": title,
                "excerpt": excerpt,
                "videoId": video_id,
                "videoUrl": args.input,
                "publishedAt": published_at,
                "tags": tags,
            }
            yaml_frontmatter = yaml.dump(
                frontmatter, allow_unicode=True, sort_keys=False
            )
            # resultから不要なコードブロック記法を除去
            cleaned_result = result.strip()
            if cleaned_result.startswith("```markdown"):
                cleaned_result = cleaned_result[len("```markdown") :].lstrip("\n")
            if cleaned_result.endswith("```"):
                cleaned_result = cleaned_result[:-3].rstrip("\n")
            markdown = f"---\n{yaml_frontmatter}---\n\n{cleaned_result}\n"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(markdown)
            with open(raw_path, "w", encoding="utf-8") as f:
                f.write(raw_text)
            logger.info(f"Summary written to: {output_path}")
            logger.info(f"Raw transcription written to: {raw_path}")
        except NotImplementedError as e:
            logger.warning(f"NotImplementedError: {e}")
            print(f"[未実装] {e}")
            sys.exit(1)
        except Exception as e:
            logger.error(f"Error in summarize_youtube_url: {e}")
            print(f"[エラー] {e}")
            sys.exit(1)
    else:
        try:
            logger.info("テキストファイルの要約処理を開始します...")
            result = summarize_text_file(args.input)
            logger.info(
                "テキストファイルの要約が完了しました。ファイル出力処理を開始します..."
            )
            base = os.path.splitext(os.path.basename(args.input))[0]
            output_path = os.path.join(args.output_dir, base + "_summary.txt")
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result)
            logger.info(f"Summary written to: {output_path}")
        except Exception as e:
            logger.error(f"Error in summarize_text_file: {e}")
            print(f"[エラー] {e}")
            sys.exit(1)
    logger.info("Summary result generated")
    print(f"要約結果を {output_path} に保存しました。")
    if raw_path:
        print(f"YouTube文字起こし生データを {raw_path} に保存しました。")


if __name__ == "__main__":
    main()
