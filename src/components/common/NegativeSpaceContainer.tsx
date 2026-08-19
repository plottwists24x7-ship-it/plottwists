"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface NegativeSpaceContainerProps {
  children: ReactNode;
  ratio?: "high" | "medium" | "low"; // Controls density boundaries
  className?: string;
}

export default function NegativeSpaceContainer({
  children,
  ratio = "medium",
  className,
}: NegativeSpaceContainerProps) {
  // Enforces negative space rules. visual density must not exceed 60%
  const paddingClasses = {
    high: "py-32 md:py-64 px-12 md:px-32", // ~85% negative space (Arrival)
    medium: "py-24 md:py-48 px-8 md:px-20", // ~60-70% negative space (Silence, Pavilion)
    low: "py-16 md:py-24 px-6 md:px-12",    // ~45-50% negative space (Inspiration, Creation)
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center",
        paddingClasses[ratio],
        className
      )}
    >
      {children}
    </div>
  );
}
