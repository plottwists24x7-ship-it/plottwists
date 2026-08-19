import React from "react";
import { HeroHeading } from "./HeroHeading";
import { HeroDescription } from "./HeroDescription";
import { HeroCTA } from "./HeroCTA";
import { HeroProduct } from "./HeroProduct";

interface HeroGridProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const HeroGrid: React.FC<HeroGridProps> = React.memo(({ onExploreClick, onStoryClick }) => {
  return (
    <div className="HeroGrid grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center flex-1 my-auto pt-16 md:pt-0">
      {/* LEFT COLUMN: Heading, Description, CTA (5 Columns, 24px higher optical shift) */}
      <div className="HeroLeftContent md:col-span-5 flex flex-col items-start text-left max-w-[640px] md:-mt-6">
        <HeroHeading />
        <HeroDescription />
        <HeroCTA onExploreClick={onExploreClick} onStoryClick={onStoryClick} />
      </div>

      {/* RIGHT COLUMN: Product Anchor & Nutrition Badges (7 Columns) */}
      <HeroProduct />
    </div>
  );
});

HeroGrid.displayName = "HeroGrid";
