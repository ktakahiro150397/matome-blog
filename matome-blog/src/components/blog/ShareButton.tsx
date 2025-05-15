"use client";

// SNSシェアボタン（Xのみ、拡張可能設計）
import { FC } from "react";
import { FaXTwitter } from "react-icons/fa6";

interface ShareButtonProps {
  url: string;
  text: string;
  className?: string;
}

export const ShareButton: FC<Omit<ShareButtonProps, "variant">> = ({
  url,
  text,
  className,
}) => {
  // X（旧Twitter）用シェアURL
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}`;

  const handleClick = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      aria-label="Xでシェア"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded bg-[#0F1419] text-white text-xs transition-colors duration-150
        hover:bg-[#22272c] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#0F1419] cursor-pointer ${
          className || ""
        }`}
      onClick={handleClick}
    >
      <FaXTwitter size={16} />
      <span>シェア</span>
    </button>
  );
};
