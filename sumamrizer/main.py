"""
サマライザーメインアプリケーション
URLやテキスト、動画から内容を文字起こしして要約するツール
"""
import argparse
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import dotenv

# 環境変数を.envファイルから読み込み
dotenv.load_dotenv()

from src.inputs import get_input_handler
from src.outputs import get_output_handler
from src.summarizers import get_summarizer
from src.transcribers import get_transcriber
from src.utils.logger import get_logger, setup_logger


# ロガーの初期化
logger = setup_logger("sumamrizer")


def parse_arguments():
    """
    コマンドライン引数をパースします。
    
    Returns:
        argparse.Namespace: パースされた引数
    """
    parser = argparse.ArgumentParser(
        description="URLやテキスト、動画から内容を文字起こしして要約するツール"
    )
    
    parser.add_argument(
        "source",
        help="入力ソース（URL、ファイルパス、またはテキスト）"
    )
    
    parser.add_argument(
        "-t", "--input-type",
        choices=["text", "url", "media", "auto"],
        default="auto",
        help="入力タイプ (デフォルト: auto)"
    )
    
    parser.add_argument(
        "-o", "--output",
        choices=["markdown", "console"],
        default="markdown",
        help="出力形式 (デフォルト: markdown)"
    )
    
    parser.add_argument(
        "-d", "--output-dir",
        help="出力ディレクトリ（markdownの場合）"
    )
    
    parser.add_argument(
        "-s", "--summarizer",
        choices=["openai", "local_llm"],
        default="openai",
        help="要約エンジン (デフォルト: openai)"
    )
    
    parser.add_argument(
        "-m", "--model",
        help="使用するモデル名（OpenAIまたはローカルLLM）"
    )
    
    parser.add_argument(
        "-w", "--whisper-model",
        default="base",
        help="Whisperモデル名 (tiny, base, small, medium, large) (デフォルト: base)"
    )
    
    parser.add_argument(
        "-g", "--gpu",
        choices=["auto", "true", "false"],
        default="auto",
        help="GPU使用設定 (デフォルト: auto)"
    )
    
    parser.add_argument(
        "--no-transcribe",
        action="store_true",
        help="文字起こしをスキップ（既にテキストの場合）"
    )
    
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="詳細なログを出力"
    )
    
    return parser.parse_args()


def process_input(
    source: str,
    input_type: str = "auto",
    config: Optional[Dict[str, Any]] = None
) -> Tuple[str, Dict[str, Any]]:
    """
    入力を処理します。
    
    Args:
        source (str): 入力ソース
        input_type (str): 入力タイプ
        config (dict, optional): 設定オプション
        
    Returns:
        tuple: (テキスト, メタデータ)
        
    Raises:
        ValueError: 入力の処理に失敗した場合
    """
    logger.info(f"Processing input: {source} (type: {input_type})")
    
    try:
        # 入力ハンドラの取得
        input_handler = get_input_handler(source, input_type, config)
        
        # 入力の読み取り
        content = input_handler.read()
        
        # メタデータの取得
        metadata = input_handler.get_metadata()
        
        logger.info(f"Input processed: {len(content)} characters")
        return content, metadata
        
    except Exception as e:
        logger.error(f"Failed to process input: {e}")
        raise ValueError(f"入力の処理に失敗しました: {e}")


def transcribe_content(
    content: str,
    metadata: Dict[str, Any],
    skip_transcribe: bool = False,
    config: Optional[Dict[str, Any]] = None
) -> Tuple[str, Dict[str, Any]]:
    """
    コンテンツを文字起こしします。
    
    Args:
        content (str): 文字起こし対象のコンテンツ（またはファイルパス）
        metadata (dict): 入力に関するメタデータ
        skip_transcribe (bool): 文字起こしをスキップするかどうか
        config (dict, optional): 設定オプション
        
    Returns:
        tuple: (文字起こし結果, 更新されたメタデータ)
        
    Raises:
        ValueError: 文字起こしに失敗した場合
    """
    # テキスト入力で文字起こしをスキップする場合
    if skip_transcribe and metadata.get("type") == "text":
        logger.info("Skipping transcription (--no-transcribe specified)")
        return content, metadata
    
    # メディアファイルの場合は必ず文字起こしを行う
    if metadata.get("type") == "media" or metadata.get("source") == "file":
        transcriber_type = "whisper"
    else:
        transcriber_type = "text"
    
    logger.info(f"Using transcriber: {transcriber_type}")
    
    try:
        # 文字起こしモジュールの取得
        transcriber = get_transcriber(transcriber_type, config)
        
        # 文字起こしの実行
        transcribed_text = transcriber.transcribe(content)
        
        # メタデータの更新
        transcriber_metadata = transcriber.get_metadata()
        metadata.update(transcriber_metadata)
        
        logger.info(f"Transcription completed: {len(transcribed_text)} characters")
        return transcribed_text, metadata
        
    except Exception as e:
        logger.error(f"Failed to transcribe content: {e}")
        raise ValueError(f"文字起こしに失敗しました: {e}")


def summarize_content(
    content: str,
    metadata: Dict[str, Any],
    summarizer_type: str = "openai",
    config: Optional[Dict[str, Any]] = None
) -> Tuple[str, Dict[str, Any]]:
    """
    コンテンツを要約します。
    
    Args:
        content (str): 要約対象のテキスト
        metadata (dict): 入力や文字起こしに関するメタデータ
        summarizer_type (str): 要約タイプ
        config (dict, optional): 設定オプション
        
    Returns:
        tuple: (要約結果, 更新されたメタデータ)
        
    Raises:
        ValueError: 要約に失敗した場合
    """
    logger.info(f"Using summarizer: {summarizer_type}")
    
    try:
        # 要約モジュールの取得
        summarizer = get_summarizer(summarizer_type, config)
        
        # 要約の実行
        summary = summarizer.summarize(content, metadata)
        
        # メタデータの更新
        summarizer_metadata = summarizer.get_metadata()
        metadata.update(summarizer_metadata)
        
        logger.info(f"Summarization completed: {len(summary)} characters")
        return summary, metadata
        
    except Exception as e:
        logger.error(f"Failed to summarize content: {e}")
        raise ValueError(f"要約に失敗しました: {e}")


def output_content(
    content: str,
    metadata: Dict[str, Any],
    output_type: str = "markdown",
    config: Optional[Dict[str, Any]] = None
) -> str:
    """
    コンテンツを出力します。
    
    Args:
        content (str): 出力するコンテンツ
        metadata (dict): 入力や処理に関するメタデータ
        output_type (str): 出力タイプ
        config (dict, optional): 設定オプション
        
    Returns:
        str: 出力先の情報
        
    Raises:
        ValueError: 出力に失敗した場合
    """
    logger.info(f"Using output handler: {output_type}")
    
    try:
        # 出力ハンドラの取得
        output_handler = get_output_handler(output_type, config)
        
        # 出力の実行
        output_info = output_handler.write(content, metadata)
        
        logger.info(f"Output completed: {output_info}")
        return output_info
        
    except Exception as e:
        logger.error(f"Failed to output content: {e}")
        raise ValueError(f"出力に失敗しました: {e}")


def main():
    """
    メイン処理
    """
    start_time = datetime.now()
    
    try:
        # 引数のパース
        args = parse_arguments()
        
        # ログレベルの設定
        if args.verbose:
            logger.setLevel("DEBUG")
        
        logger.info("Starting sumamrizer")
        logger.debug(f"Arguments: {args}")
        
        # 設定の作成
        config = {
            "use_gpu": args.gpu,
            "verbose": args.verbose,
        }
        
        # 入力処理の設定
        input_config = config.copy()
        
        # 文字起こし処理の設定
        transcribe_config = config.copy()
        if args.whisper_model:
            transcribe_config["model_name"] = args.whisper_model
        
        # 要約処理の設定
        summarize_config = config.copy()
        if args.model:
            summarize_config["model_name"] = args.model
        
        # 出力処理の設定
        output_config = config.copy()
        if args.output_dir:
            output_config["output_dir"] = args.output_dir
        
        # 入力の処理
        content, metadata = process_input(args.source, args.input_type, input_config)
        
        # 文字起こし
        transcribed_text, metadata = transcribe_content(
            content, metadata, args.no_transcribe, transcribe_config
        )
        
        # 要約
        summary, metadata = summarize_content(
            transcribed_text, metadata, args.summarizer, summarize_config
        )
        
        # 出力
        output_info = output_content(summary, metadata, args.output, output_config)
        
        # 処理時間の計算
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.info(f"Processing completed in {processing_time:.2f} seconds")
        
        # コンソール出力でない場合は結果を表示
        if args.output != "console":
            print(f"\n処理が完了しました: {output_info}")
            print(f"処理時間: {processing_time:.2f}秒")
        
        return 0
        
    except KeyboardInterrupt:
        logger.warning("Process interrupted by user")
        return 130
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        print(f"エラー: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
