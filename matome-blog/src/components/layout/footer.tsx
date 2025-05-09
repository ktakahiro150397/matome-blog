"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-background mt-12">
      <div className="container flex flex-col gap-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">コンテンツ</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground">新着記事</Link>
              <Link href="/tags" className="hover:text-foreground">タグ一覧</Link>
              <Link href="/about" className="hover:text-foreground">About</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">リソース</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/sitemap.xml" className="hover:text-foreground">サイトマップ</Link>
              <Link href="/rss.xml" className="hover:text-foreground">RSS</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">お問い合わせ</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/contact" className="hover:text-foreground">お問い合わせフォーム</Link>
            </nav>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} つべのまとめ. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ホーム
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}