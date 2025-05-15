# 実装タスクリスト

## 1. ディレクトリ・ファイル構成の作成
- [x] 基本ディレクトリ（inputs/, transcribers/, summarizers/, outputs/, utils/）の作成 - 完了
- [ ] プロジェクト初期設定ファイルの作成

## 2. 依存パッケージとpyproject.toml
- [ ] pyproject.tomlの設定（uvを使用）
  ```toml
  [build-system]
  requires = ["hatchling"]
  build-backend = "hatchling.build"

  [project]
  name = "sumamrizer"
  version = "0.1.0"
  description = "URLやテキスト、動画から内容を文字起こしして要約するツール"
  readme = "README.md"
  requires-python = ">=3.8"
  dependencies = [
      "langchain",
      "openai",
      "transformers",
      "openai-whisper",
      "torch",
      "faster-whisper",  # GPU対応Whisper代替
      "requests",
      "beautifulsoup4",  # URL処理用
      "python-dotenv",   # 環境変数管理
  ]

  [project.scripts]
  sumamrizer = "sumamrizer.main:main"
  ```
- [ ] .envファイルの雛形作成（APIキー等の環境変数用）

## 3. ロガー（utils/logger.py）実装
- [ ] ローテーション付きファイルロガーの実装
- [ ] ログレベル設定の実装

## 4. 入力ハンドラ（inputs/）実装
- [ ] 基底クラス/インターフェース定義（入力タイプごとの共通操作）
- [ ] テキスト入力ハンドラ実装
- [ ] URL入力ハンドラ実装
- [ ] 動画/音声ファイル入力ハンドラ実装
- [ ] 入力タイプ自動判別機能の実装

## 5. 文字起こし（transcribers/）実装
- [ ] 基底クラス/インターフェース定義
- [ ] GPU検出と利用設定の実装
- [ ] Whisper（またはFaster-Whisper）を使った文字起こし実装
- [ ] テキスト（既にテキストの場合はそのまま出力する）処理の実装

## 6. 要約（summarizers/）実装
- [ ] 基底クラス/インターフェース定義
- [ ] LangChainを使ったAPI要約（OpenAI等）実装
- [ ] LangChainを使ったローカルLLM要約実装
- [ ] マークダウン形式出力のプロンプトテンプレート

## 7. 出力処理（outputs/）実装
- [ ] 基底クラス/インターフェース定義
- [ ] Markdownファイル出力実装
- [ ] 標準出力実装
- [ ] その他出力フォーマット対応（オプション）

## 8. main.py実装
- [ ] CLI引数のパース処理
- [ ] 設定ファイル読み込み処理
- [ ] 全体フロー実装（入力→文字起こし→要約→出力）
- [ ] エラーハンドリング

## 9. テスト実装
- [ ] ユニットテスト（各コンポーネント）
- [ ] 統合テスト（全体フロー）

## 10. ドキュメント作成
- [ ] ユーザーガイド
- [ ] API/開発者ドキュメント
- [ ] README.mdの詳細化

## 備考
- uvパッケージマネージャを使用
- GPU対応の動画文字起こしはWhisper（またはFaster-Whisper）で実装
- LangChainを使って要約処理のAPI/ローカル両対応を実現
- ログはRotatingFileHandlerでローカルテキストファイルに出力
