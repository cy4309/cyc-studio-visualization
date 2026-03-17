"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface OffsetShadowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * 偏移陰影按鈕（Offset Shadow / Neo-brutalist 風格）
 * 右下有黑色陰影層，按下時按鈕收合至陰影位置
 */
export function OffsetShadowButton({
  children,
  className = "",
  ...props
}: OffsetShadowButtonProps) {
  return (
    <button
      type="button"
      className={[
        "group relative flex items-center justify-center outline-none cursor-pointer select-none",
        "w-[52px] h-[52px] rounded-[12px]",
        "bg-transparent border-none",
        "text-secondary font-bold text-[26px] uppercase",
        // 也可用 tailwindcss 寫法：
        /* ::before 右下陰影層 */
        "before:content-[''] before:absolute before:left-1 before:top-1 before:w-full before:h-full before:-z-[2]",
        "before:rounded-[12px] before:bg-secondary before:transition-[left,top] before:duration-100",
        /* ::after 按鈕主體 */
        "after:content-[''] after:absolute after:inset-0 after:rounded-[12px] after:border-[3px] after:border-secondary",
        "after:bg-black after:-z-[1] after:transition-[left,top] after:duration-100",
        /* active 時收合至陰影位置 */
        "active:after:left-1 active:after:top-1 active:after:w-full active:after:h-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="inline-flex transition-transform duration-100 group-active:translate-x-1 group-active:translate-y-1">
        {children}
      </span>
    </button>
  );
}
