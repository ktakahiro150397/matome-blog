# Active Context

## Current Focus
- ブログ機能の拡張
- UI/UXの改善
- グローバルレイアウトの実装

## Recent Decisions
1. コンテンツ管理方式
   - MDXファイルベースを採用（実装完了）
   - メタデータ検索用にSQLiteを使用（実装完了）
   - フロントマターでメタデータを管理（実装完了）
   - コンテンツ同期スクリプトによる管理（実装完了）

2. 技術スタックの実装状況
   - ✅ Next.js App Router
   - ✅ shadcn/ui
   - ✅ Tailwind CSS
   - ✅ next-themes
   - ✅ Prisma (SQLite)
   - ✅ MDX

3. コンポーネント設計
   - Client/Server Componentの使い分け
   - BlogCard, TableOfContentsなどの対話的なコンポーネントはClient Components
   - ページレベルのコンポーネントはServer Components

4. タグ機能の実装
   - ✅ タグユーティリティ関数（`getAllTags`, `getPostsByTag`, `findTagBySlug`, `tagToSlug`）
   - ✅ タグ表示コンポーネント（`TagList`, `TagCloud`）
   - ✅ タグ一覧ページ（`/tags`）とタグ詳細ページ（`/tags/[slug]`）
   - ✅ 日本語タグのURLエンコード対応
   - ✅ ユニットテスト実装

5. グローバルレイアウトの実装
   - ✅ ヘッダーの実装（サイト名「つべのまとめ」を設置）
   - ✅ ナビゲーションの実装（「新着」と「タグ一覧」リンクを追加）
   - 🚧 フッターの実装

## Next Steps
1. グローバルレイアウトの完成
   - フッターの作成
   - モバイル対応ナビゲーションの実装

2. 検索機能の実装
   - 検索UIの設計
   - バックエンド検索ロジックの実装
   - 検索結果の表示

3. UI/UXの改善
   - レスポンシブデザインの最適化
   - アニメーションの追加
   - ローディング状態の改善

## Active Considerations
- 検索機能の実装方法（クライアントサイド vs サーバーサイド）
- パフォーマンス最適化
- MDXコンテンツのキャッシング戦略
- Client/Server Componentsの適切な使い分け
- ページネーションの実装方法