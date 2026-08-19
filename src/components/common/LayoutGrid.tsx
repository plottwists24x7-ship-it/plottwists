"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface LayoutGridProps {
  columns?: 4 | 8 | 12;
  gap?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

export default function LayoutGrid({
  columns = 12,
  gap = "md",
  className,
  children,
}: LayoutGridProps) {
  // Configures structural layouts based on spatial grid spacing tokens
  const colClasses = {
    12: "grid-cols-12",
    8: "grid-cols-8",
    4: "grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4 md:gap-6",
    md: "gap-6 md:gap-12",
    lg: "gap-12 md:gap-24",
  };

  return (
    <div
      className={cn(
        "grid w-full h-full max-w-7xl mx-auto px-6 md:px-16",
        colClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
