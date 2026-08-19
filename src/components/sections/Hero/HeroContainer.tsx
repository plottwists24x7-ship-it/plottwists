import React from "react";
import { HeroGrid } from "./HeroGrid";
import { HeroEditorialLayer } from "./HeroEditorialLayer";

interface HeroContainerProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
}

export const HeroContainer: React.FC<HeroContainerProps> = React.memo(({ onExploreClick = () => {}, onStoryClick = () => {} }) => {
  return (
    <div className="HeroContainer relative w-full max-w-[1480px] mx-auto px-8 md:px-[64px] min-h-[calc(100vh-80px)] flex items-center justify-center pt-28 pb-12 overflow-hidden">
      <HeroEditorialLayer />
      <HeroGrid onExploreClick={onExploreClick} onStoryClick={onStoryClick} />
    </div>
  );
});

HeroContainer.displayName = "HeroContainer";
