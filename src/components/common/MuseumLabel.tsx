"use client";

import { cn } from "@/utils/cn";

interface MuseumLabelProps {
  title: string;
  category: string;
  dimensions?: string;
  className?: string;
}

export default function MuseumLabel({
  title,
  category,
  dimensions,
  className,
}: MuseumLabelProps) {
  return (
    <div
      className={cn(
        "select-none font-mono text-[0.62rem] text-graphite-ink/50 uppercase tracking-[0.15em] border-l border-graphite-ink/15 pl-4 flex flex-col gap-1.5",
        className
      )}
    >
      <span className="text-sienna-oxide tracking-[0.2em] font-semibold">{category}</span>
      <h4 className="font-serif text-[0.8rem] normal-case text-graphite-ink font-semibold tracking-normal">
        {title}
      </h4>
      {dimensions && <span className="opacity-70 font-light">[ {dimensions} ]</span>}
    </div>
  );
}
