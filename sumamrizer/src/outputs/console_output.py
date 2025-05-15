"""
標準出力（コンソール）への出力処理の実装
"""
from typing import Any, Dict, Optional

from ..utils.logger import get_logger
from . import OutputHandler


logger = get_logger("outputs.console")


class ConsoleOutputHandler(OutputHandler):
    """
    標準出力（コンソール）への出力ハンドラ
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.show_metadata = config.get("show_metadata", False) if config else False
        logger.debug(f"ConsoleOutputHandler initialized: show_metadata={self.show_metadata}")
    
    def write(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        コンテンツを標準出力に出力します。
        
        Args:
            content (str): 出力するコンテンツ
            metadata (dict, optional): 入力や処理に関するメタデータ
            
        Returns:
            str: 出力先の情報（この場合は常に "console"）
        """
        # メタデータの出力（設定されている場合）
        if self.show_metadata and metadata:
            print("\n===== METADATA =====")
            for key, value in metadata.items():
                # 辞書型の値は整形して表示
                if isinstance(value, dict):
                    print(f"{key}:")
                    for sub_key, sub_value in value.items():
                        print(f"  {sub_key}: {sub_value}")
                else:
                    print(f"{key}: {value}")
            print("====================\n")
        
        # 本文出力
        print(content)
        
        logger.info(f"Successfully wrote {len(content)} characters to console")
        return "console"
