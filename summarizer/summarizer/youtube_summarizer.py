import os
import yt_dlp
import whisper
import logging
from logging.handlers import RotatingFileHandler
import uuid

# ログ設定
log_path = os.path.join(os.path.dirname(__file__), "../summarizer.log")
log_path = os.path.abspath(log_path)
logger = logging.getLogger("summarizer")
logger.setLevel(logging.INFO)
handler = RotatingFileHandler(
    log_path, maxBytes=1024 * 1024, backupCount=3, encoding="utf-8"
)
formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s %(filename)s:%(lineno)d %(message)s"
)
handler.setFormatter(formatter)
logger.addHandler(handler)


def summarize_youtube_url(url: str) -> str:
    """
    YouTube動画のURLを受け取り、音声認識して文字起こしテキストを返す
    """
    logger.info(f"Start downloading audio from: {url}")
    # ./temp ディレクトリを作成
    temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../temp"))
    os.makedirs(temp_dir, exist_ok=True)
    # 拡張子なしでテンプレート指定
    audio_base = os.path.join(temp_dir, f"audio_{uuid.uuid4().hex}")
    # yt-dlpで音声のみダウンロード
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": audio_base,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
        "quiet": True,
    }
    audio_path = audio_base + ".wav"
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        logger.info(f"Audio downloaded to: {audio_path}")
    except Exception as e:
        logger.error(f"yt-dlp error: {e}")
        raise
    # whisperで文字起こし
    try:
        model = whisper.load_model("base")  # より高精度なら"small"や"medium"も可
        result = model.transcribe(audio_path, language="ja")
        logger.info("Transcription completed")
        return result["text"]
    except Exception as e:
        logger.error(f"whisper error: {e}")
        raise
    finally:
        # 音声ファイルを削除
        if os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                logger.info(f"Temp audio file removed: {audio_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temp audio file: {e}")
