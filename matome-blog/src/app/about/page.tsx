import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About このブログについて</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">プロジェクト概要</h2>
        <p>
          このブログは、YouTube動画の要約コンテンツを効果的に配信するためのプラットフォームです。検索エンジン最適化（SEO）とAIによる情報解析のしやすさを重視し、MDX形式で管理された記事を高速かつ快適に閲覧できます。
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">主な特徴</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>MDXベースの柔軟な記事管理</li>
          <li>SQLiteによるローカル検索と高速な記事発見</li>
          <li>タグ・目次・関連コンテンツによるナビゲーション</li>
          <li>ダーク/ライトテーマ対応・モバイルフレンドリー</li>
          <li>SEO最適化・構造化データ・RSSフィード対応</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">技術スタック</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Next.js（App Router）</li>
          <li>shadcn/ui + Tailwind CSS</li>
          <li>MDXコンテンツ管理</li>
          <li>Prisma + SQLiteによるメタデータ管理</li>
          <li>TypeScriptによる型安全な開発</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">このブログが目指すもの</h2>
        <p>
          読者がYouTube動画の要点を素早く把握できるようにし、効率的な情報収集と新たな発見をサポートします。運営者にとっても、記事の管理や拡張が容易な設計となっています。
        </p>
      </section>
    </main>
  );
}
