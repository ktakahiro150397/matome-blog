"use client";

import { useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Menu, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-lg font-semibold"
        >
          <span>つべのまとめ</span>
        </Link>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex items-center">
          <Separator orientation="vertical" className="mx-6 h-6" />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/blog">新着</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/tags">タグ一覧</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/search" className="flex items-center gap-1">
                    <Search size={16} />
                    <span>検索</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>カテゴリー</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tags/technology"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          テクノロジー
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          最新のテクノロジートレンドと解説
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* モバイル用ハンバーガーメニュー */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-foreground">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full py-6">
              <div className="px-6 mb-4 flex justify-between items-center">
                <Link
                  href="/"
                  className="text-lg font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  つべのまとめ
                </Link>
                <button
                  className="p-2 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-3 px-6">
                <Link
                  href="/blog"
                  className="py-2 border-b border-muted"
                  onClick={() => setIsOpen(false)}
                >
                  新着
                </Link>
                <Link
                  href="/tags"
                  className="py-2 border-b border-muted"
                  onClick={() => setIsOpen(false)}
                >
                  タグ一覧
                </Link>
                <Link
                  href="/search"
                  className="py-2 border-b border-muted flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Search size={16} />
                  <span>検索</span>
                </Link>
                <Link
                  href="/tags/technology"
                  className="py-2 border-b border-muted"
                  onClick={() => setIsOpen(false)}
                >
                  テクノロジー
                </Link>
                <Link
                  href="/about"
                  className="py-2 border-b border-muted"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
