"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TypographyVariant = "display" | "h1" | "h2" | "body-lg" | "body-md" | "label-mono";

interface EditorialTextProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditorialText({
  variant,
  children,
  className,
  style,
}: EditorialTextProps) {
  const variantStyles: Record<TypographyVariant, string> = {
    display: "text-[3.5rem] md:text-[5.5rem] leading-[1.05] tracking-tight text-graphite-ink font-serif",
    h1: "text-[2.5rem] md:text-[3.5rem] leading-[1.1] tracking-tight text-graphite-ink font-serif",
    h2: "text-[1.8rem] md:text-[2.25rem] leading-[1.2] tracking-tight text-graphite-ink font-serif",
    "body-lg": "text-base md:text-[1.25rem] leading-[1.6] text-graphite-ink/70 font-light max-w-xl",
    "body-md": "text-xs md:text-sm leading-[1.7] text-graphite-ink/65 font-light max-w-md",
    "label-mono": "text-[0.62rem] md:text-[0.68rem] leading-[1.5] tracking-[0.15em] font-mono uppercase text-sienna-oxide",
  };

  return (
    <div className={cn(variantStyles[variant], className)} style={style}>
      {children}
    </div>
  );
}
