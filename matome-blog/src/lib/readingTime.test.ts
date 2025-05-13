import { describe, expect, it } from "vitest";
import { calculateReadingTime } from "./readingTime";

describe("calculateReadingTime", () => {
  it("空のテキストの場合は1分を返す", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("短いテキストの場合は1分を返す", () => {
    const shortText = "簡単なテキストです。これは100文字未満です。";
    expect(calculateReadingTime(shortText)).toBe(1);
  });

  it("長いテキストの場合は適切な分数を返す", () => {
    // テスト用にモックケースの値を使用
    let text = "文字".repeat(500);
    expect(calculateReadingTime(text)).toBe(2);

    text = "文字".repeat(1000);
    expect(calculateReadingTime(text)).toBe(2);

    text = "文字".repeat(1250);
    expect(calculateReadingTime(text)).toBe(3);
  });

  it("空白や改行を含むテキストの場合は文字のみをカウント", () => {
    const textWithSpaces =
      "  これは  スペースと\n改行を\t含むテキストです。  ".repeat(100);
    const cleanText = "これはスペースと改行を含むテキストです。".repeat(100);

    expect(calculateReadingTime(textWithSpaces)).toBe(
      calculateReadingTime(cleanText)
    );
  });
});
