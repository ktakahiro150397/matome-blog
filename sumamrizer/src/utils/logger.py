"""
ロギング機能を提供するモジュール。
ローテーション付きファイルロガーを実装します。
"""
import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path


def setup_logger(
    logger_name="sumamrizer",
    log_file="sumamrizer.log",
    level=logging.INFO,
    max_bytes=10485760,  # 10MB
    backup_count=3,
    console_output=True,
):
    """
    アプリケーション全体で使用するロガーをセットアップします。
    
    Args:
        logger_name (str): ロガーの名前
        log_file (str): ログファイルのパス
        level (int): ログレベル（logging.DEBUG, logging.INFO, など）
        max_bytes (int): ログファイルの最大サイズ（バイト）
        backup_count (int): 保持するバックアップファイルの数
        console_output (bool): 標準出力にもログを出力するかどうか
        
    Returns:
        logging.Logger: 設定済みのロガーインスタンス
    """
    # 環境変数からログレベルを取得（設定されていない場合はデフォルト値を使用）
    log_level_name = os.environ.get("LOG_LEVEL", "INFO")
    log_level = getattr(logging, log_level_name, logging.INFO)
    
    # 環境変数からログファイル名を取得（設定されていない場合はデフォルト値を使用）
    log_file = os.environ.get("LOG_FILE", log_file)
    
    # 環境変数からログファイルの最大サイズとバックアップ数を取得
    max_bytes = int(os.environ.get("LOG_MAX_BYTES", max_bytes))
    backup_count = int(os.environ.get("LOG_BACKUP_COUNT", backup_count))
    
    # ロガーの取得
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)
    
    # ロガーに既にハンドラが追加されている場合はスキップ
    if logger.hasHandlers():
        return logger
    
    # フォーマッタの作成
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # ログディレクトリの確認と作成
    log_path = Path(log_file)
    log_dir = log_path.parent
    if not log_dir.exists() and str(log_dir) != ".":
        log_dir.mkdir(parents=True, exist_ok=True)
    
    # ファイルハンドラの作成
    file_handler = RotatingFileHandler(
        log_file, maxBytes=max_bytes, backupCount=backup_count
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    # コンソール出力設定
    if console_output:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    logger.info(f"Logger initialized: {logger_name} (level: {log_level_name})")
    return logger


# デフォルトロガー
logger = setup_logger()


def get_logger(name=None):
    """
    名前付きロガーを取得します。
    
    Args:
        name (str, optional): ロガー名。Noneの場合はデフォルトロガーを返します。
        
    Returns:
        logging.Logger: ロガーインスタンス
    """
    if name is None:
        return logger
    
    return logging.getLogger(f"sumamrizer.{name}")
