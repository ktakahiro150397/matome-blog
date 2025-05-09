"use client"

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

interface TableOfContentsProps {
  headings: Array<{ id: string; text: string; level: number }>;
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto">
      <h2 className="text-lg font-semibold">目次</h2>
      <Separator className="my-4" />
      <ul className="space-y-3 text-sm">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 2) * 1}rem` }}
            className="line-clamp-2"
          >
            <a
              href={`#${id}`}
              className={`hover:text-primary transition-colors ${
                activeId === id ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}