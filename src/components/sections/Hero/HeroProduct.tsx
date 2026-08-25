import React from "react";
import Image from "next/image";
import { HeroPaperStack } from "./HeroPaperStack";
import { HeroTornPaperMask } from "./HeroTornPaperMask";
import { HeroWashiTapeSystem } from "./HeroWashiTapeSystem";
import { HeroStickyNote } from "./HeroStickyNote";

export const HeroProduct: React.FC = React.memo(() => {
  return (
    <div className="HeroRightContent md:col-span-7 flex items-center justify-center relative mt-4 sm:mt-6 md:mt-0 md:-translate-x-[15%]">
      {/* 9-Tier Z-Index Stacking Context Anchor */}
      <div className="relative w-[clamp(260px,70vw,380px)] h-[clamp(260px,70vw,380px)] md:w-[clamp(360px,41vw,680px)] md:h-[clamp(360px,41vw,680px)] flex items-center justify-center">
        {/* z-5: 4-Layer Paper Stack */}
        <HeroPaperStack />

        {/* z-10: Organic Torn Paper Frame Mounted Around Cheesecake */}
        <HeroTornPaperMask />

        {/* z-20: Circular Cheesecake Dessert Anchor */}
        <div 
          className="HeroProduct relative w-full h-full rounded-full border-4 border-[#3D2E25] overflow-hidden shadow-[0_24px_60px_rgba(61,46,37,0.10)] z-20 flex-shrink-0 animate-cheesecake-breathe"
          style={{ animationDelay: "1s" }}
        >
          <Image
            src="/images/baker-where/prod_cheesecake.jpg"
            alt="Artisanal cheesecake representation"
            fill
            priority
            sizes="(max-width: 768px) 380px, 680px"
            className="object-cover"
          />
        </div>

        {/* z-30: 4-Piece Fibrous Washi Tape System */}
        <HeroWashiTapeSystem />

        {/* z-35: Single Handmade Daily Sticky Note */}
        <HeroStickyNote />
      </div>
    </div>
  );
});

HeroProduct.displayName = "HeroProduct";
