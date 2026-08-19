import React from "react";

export interface CrumbsProps {
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Crumbs: React.FC<CrumbsProps> = React.memo(({
  opacity = 0.15,
  className = "",
  style = {}
}) => {
  return (
    <div
      className={`Crumbs pointer-events-none select-none ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      <svg className="w-16 h-12 text-[#3D2E25]" viewBox="0 0 64 48" fill="currentColor">
        <circle cx="10" cy="12" r="1.8" /><circle cx="28" cy="34" r="1.2" /><circle cx="52" cy="14" r="2.2" /><circle cx="40" cy="28" r="1" />
      </svg>
    </div>
  );
});

Crumbs.displayName = "Crumbs";
