# Active Context

## Current Focus
- ブログ機能の拡張
- UI/UXの改善
- SEO対応の実装
- 検索・ページネーション・同期スクリプトの実装・テスト

## Recent Decisions
1. コンテンツ管理方式
   - MDXファイルベースを採用（実装完了）
   - メタデータ検索用にSQLiteを使用（実装完了）
   - フロントマターでメタデータを管理（publishedAtに統一、全記事修正済み）
   - コンテンツ同期スクリプトの堅牢化（videoId, videoUrlの補完対応）
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
   - ✅ フッターの実装（コンテンツリンク、リソースリンク、お問い合わせ、コピーライト、その他リンク）
   - ✅ モバイル対応ナビゲーションの実装（ハンバーガーメニューとスライドインナビゲーション）
6. 検索・ページネーション・同期スクリプトの実装
   - ✅ 記事タイトル・タグ・抜粋による全文検索ロジック（Prisma/SQLite）
   - ✅ 検索UIコンポーネント（SearchInput, SearchPage）
   - ✅ ページネーション対応（ルート・検索画面ともに上下ページャー）
   - ✅ BlogListのページャーprops拡張（showPagerTop/showPagerBottom）
   - ✅ テスト用MDXデータ20件自動生成
   - ✅ Prismaクライアントのモック化
   - ✅ 検索・ページネーションのテストカバレッジ確保
   - ✅ 同期スクリプトの堅牢化（frontmatter.publishedAt統一、videoId/videoUrl補完）

## Next Steps
1. 検索・ページネーションのテスト拡充
   - エッジケース・エラーケースのテスト追加
   - 検索UIのユーザビリティ改善
   - 検索・一覧ページのデザイン調整
2. UI/UXの改善
   - レスポンシブデザインの最適化
   - アニメーションの追加
   - ローディング状態の改善
3. SEO対応
   - メタデータコンポーネントの改善
   - OGイメージ生成機能
   - 構造化データの実装

## Active Considerations
- 検索・ページネーションのパフォーマンス最適化
- MDXコンテンツのキャッシング戦略
- Client/Server Componentsの適切な使い分け
- テストの信頼性と保守性
- UI/UX一貫性の維持