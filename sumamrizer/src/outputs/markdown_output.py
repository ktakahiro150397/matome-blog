"""
マークダウン形式での出力処理の実装
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from ..utils.logger import get_logger
from . import OutputHandler


logger = get_logger("outputs.markdown")


class MarkdownOutputHandler(OutputHandler):
    """
    マークダウン形式での出力ハンドラ
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        
        # 出力ディレクトリの設定
        self.output_dir = config.get("output_dir") if config else None
        if not self.output_dir:
            self.output_dir = os.environ.get("OUTPUT_DIR", "./outputs")
        
        # 出力ディレクトリが存在しない場合は作成
        self.output_dir = Path(self.output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        logger.debug(f"MarkdownOutputHandler initialized: output_dir={self.output_dir}")
    
    def write(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        コンテンツをマークダウンファイルとして出力します。
        
        Args:
            content (str): 出力するコンテンツ
            metadata (dict, optional): 入力や処理に関するメタデータ
            
        Returns:
            str: 出力したファイルパス
            
        Raises:
            IOError: ファイルの出力に失敗した場合
        """
        # ファイル名の生成
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # メタデータからタイトルを取得（あれば）
        title = "summary"
        if metadata:
            if "title" in metadata:
                title = self._sanitize_filename(metadata["title"])
            elif "file_name" in metadata:
                title = self._sanitize_filename(Path(metadata["file_name"]).stem)
        
        filename = f"{timestamp}_{title}.md"
        output_path = self.output_dir / filename
        
        # メタデータヘッダーを作成
        header = self._create_metadata_header(metadata)
        
        try:
            logger.info(f"Writing markdown output to: {output_path}")
            with open(output_path, "w", encoding="utf-8") as f:
                if header:
                    f.write(header + "\n\n")
                f.write(content)
            
            logger.info(f"Successfully wrote {len(content)} characters to {output_path}")
            return str(output_path)
            
        except IOError as e:
            error_msg = f"Failed to write to file {output_path}: {e}"
            logger.error(error_msg)
            raise IOError(error_msg)
    
    def _sanitize_filename(self, name: str) -> str:
        """
        ファイル名に使用できない文字を置き換えて安全なファイル名を返します。
        
        Args:
            name (str): 元のファイル名
            
        Returns:
            str: 安全なファイル名
        """
        # ファイル名に使用できない文字を置き換え
        invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
        result = name
        for char in invalid_chars:
            result = result.replace(char, '_')
        
        # 長すぎる場合は切り詰め
        max_length = 50
        if len(result) > max_length:
            result = result[:max_length]
        
        return result
    
    def _create_metadata_header(self, metadata: Optional[Dict[str, Any]]) -> str:
        """
        マークダウンの先頭に付けるメタデータヘッダーを作成します。
        
        Args:
            metadata (dict, optional): 入力や処理に関するメタデータ
            
        Returns:
            str: メタデータヘッダーの文字列
        """
        if not metadata:
            return ""
        
        lines = ["---"]
        
        # 基本情報
        lines.append(f"created: {datetime.now().isoformat()}")
        
        # 入力情報
        if "type" in metadata:
            lines.append(f"source_type: {metadata['type']}")
        
        if "url" in metadata:
            lines.append(f"source_url: \"{metadata['url']}\"")
        
        if "file_path" in metadata:
            lines.append(f"source_file: \"{metadata['file_path']}\"")
        
        if "title" in metadata:
            lines.append(f"title: \"{metadata['title']}\"")
        
        # 処理情報
        if "transcriber" in metadata:
            lines.append(f"transcriber: {metadata['transcriber']}")
            if "model_name" in metadata:
                lines.append(f"transcriber_model: \"{metadata['model_name']}\"")
        
        if "summarizer" in metadata:
            lines.append(f"summarizer: {metadata['summarizer']}")
            if "model_name" in metadata:
                lines.append(f"summarizer_model: \"{metadata['model_name']}\"")
        
        lines.append("---")
        
        return "\n".join(lines)
