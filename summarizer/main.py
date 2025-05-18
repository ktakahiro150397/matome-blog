import argparse
import sys
from summarizer.text_summarizer import summarize_text_file
from summarizer.youtube_summarizer import summarize_youtube_url


def is_youtube_url(input_str: str) -> bool:
    return input_str.startswith("http://") or input_str.startswith("https://")


def main():
    parser = argparse.ArgumentParser(
        description="テキストまたはYouTube動画を要約するツール"
    )
    parser.add_argument(
        "-i", "--input", required=True, help="テキストファイルのパスまたはYouTubeのURL"
    )
    args = parser.parse_args()

    if is_youtube_url(args.input):
        try:
            result = summarize_youtube_url(args.input)
        except NotImplementedError as e:
            print(f"[未実装] {e}")
            sys.exit(1)
    else:
        result = summarize_text_file(args.input)
    print(result)


if __name__ == "__main__":
    main()
