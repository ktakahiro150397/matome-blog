import argparse
import os
import sys
from summarizer.text_summarizer import summarize_text, summarize_text_file
from summarizer.youtube_summarizer import summarize_youtube_url, logger


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
                "YouTube動画の要約が完了しました。ファイル出力処理を開始します..."
            )
            # ファイル名生成
            import datetime

            ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            base = f"youtube_{ts}"
            output_path = os.path.join(args.output_dir, base + "_summary.txt")
            raw_path = os.path.join(args.output_dir, base + "_raw.txt")
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result)
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
