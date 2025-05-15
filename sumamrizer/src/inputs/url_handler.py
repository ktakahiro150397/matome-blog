"""
URL入力ハンドラの実装
"""
import re
from datetime import datetime
from typing import Any, Dict, Optional, Union

import requests
from bs4 import BeautifulSoup

from ..utils.logger import get_logger
from . import InputHandler


logger = get_logger("inputs.url")


class URLInputHandler(InputHandler):
    """
    URLからコンテンツを取得するハンドラ
    """
    
    def __init__(self, url: str, config: Optional[Dict[str, Any]] = None):
        """
        初期化
        
        Args:
            url (str): コンテンツを取得するURL
            config (dict, optional): 設定オプション
        """
        super().__init__(config)
        self.url = url
        self.title = ""
        self.raw_html = ""
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        }
        
        # 設定からヘッダーをマージ
        if config and "headers" in config:
            self.headers.update(config["headers"])
        
        logger.debug(f"URLInputHandler initialized for: {url}")
    
    def read(self) -> str:
        """
        URLからコンテンツを取得し、テキストとして返します。
        
        Returns:
            str: 取得したテキスト
            
        Raises:
            ValueError: URLが無効な場合
            IOError: コンテンツの取得に失敗した場合
        """
        if not self.url.startswith(("http://", "https://")):
            error_msg = f"Invalid URL: {self.url}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        try:
            logger.info(f"Fetching content from URL: {self.url}")
            response = requests.get(self.url, headers=self.headers, timeout=30)
            response.raise_for_status()
            self.raw_html = response.text
            
            # HTMLをパースしてテキストを抽出
            soup = BeautifulSoup(self.raw_html, "html.parser")
            
            # タイトルを取得
            if soup.title:
                self.title = soup.title.string.strip()
            
            # 不要なタグを削除
            for tag in soup(["script", "style", "meta", "link", "noscript", "iframe", "svg"]):
                tag.decompose()
            
            # メインコンテンツを抽出する試み
            # 1. articleタグを探す
            article = soup.find("article")
            if article:
                content = article
            # 2. mainタグを探す
            elif soup.find("main"):
                content = soup.find("main")
            # 3. contentクラスなどがあるdivを探す
            elif soup.find("div", {"id": re.compile(r"content|main", re.I)}):
                content = soup.find("div", {"id": re.compile(r"content|main", re.I)})
            elif soup.find("div", {"class": re.compile(r"content|main|post", re.I)}):
                content = soup.find("div", {"class": re.compile(r"content|main|post", re.I)})
            # 4. 何も見つからなければbodyを使用
            else:
                content = soup.body
            
            # テキストを抽出して整形
            text = self._extract_text_from_element(content if content else soup)
            logger.debug(f"Successfully extracted {len(text)} characters from URL")
            return text
            
        except requests.RequestException as e:
            error_msg = f"Failed to fetch content from URL {self.url}: {e}"
            logger.error(error_msg)
            raise IOError(error_msg)
    
    def _extract_text_from_element(self, element) -> str:
        """
        BeautifulSoupの要素からテキストを抽出し、整形します。
        
        Args:
            element: BeautifulSoupの要素
            
        Returns:
            str: 整形されたテキスト
        """
        if not element:
            return ""
        
        # 各段落をリストに抽出
        paragraphs = []
        
        # 段落となる可能性があるタグ
        for tag in element.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"]):
            text = tag.get_text(strip=True)
            if text and len(text) > 1:  # 空白や単一文字は除外
                # タグによって書式を調整
                if tag.name.startswith('h'):
                    # 見出しの場合
                    level = int(tag.name[1])
                    paragraphs.append(f"{'#' * level} {text}")
                else:
                    paragraphs.append(text)
        
        # 段落間に空白行を挿入して結合
        return "\n\n".join(paragraphs)
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        URL入力に関するメタデータを取得します。
        
        Returns:
            dict: メタデータの辞書
        """
        return {
            "type": "url",
            "source": "web",
            "url": self.url,
            "title": self.title,
            "timestamp": datetime.now().isoformat(),
        }
