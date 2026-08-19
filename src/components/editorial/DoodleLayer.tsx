import React from "react";
import { Scribble } from "./Scribble";
import { PaperNote } from "./PaperNote";
import { WashiTape } from "./WashiTape";
import { VintageStamp } from "./VintageStamp";
import { Sticker } from "./Sticker";
import { CoffeeStain } from "./CoffeeStain";
import { Crumbs } from "./Crumbs";

export const DoodleLayer: React.FC = React.memo(() => {
  return (
    <div className="DoodleLayer absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* Rule 22: Faint 5% Partial Coffee Stain Ring Tucked Behind Paper Stack */}
      <CoffeeStain className="absolute top-[6%] right-[22%] w-16 h-16" rotation={12} opacity={0.05} />

      {/* Rules 16 & 17: Food Details & Crumbs (Around Cheesecake Only) */}
      <Crumbs className="absolute top-[38%] right-[18%]" opacity={0.18} />
      <Crumbs className="hidden sm:block absolute bottom-[22%] left-[36%]" opacity={0.15} />

      {/* Rules 21, 23, 24: Editorial Ink Connectors (Dots, Crosses, Flourishes) */}
      <Scribble type="loop" color="#2E2B28" rotation={-12} opacity={0.35} className="absolute top-[5%] left-[4%]" />
      <Scribble type="heart" color="#E58981" rotation={14} opacity={0.45} className="absolute top-[16%] right-[18%]" />
      <Scribble type="star" color="#D9B45B" rotation={-8} opacity={0.50} className="absolute top-[28%] left-[42%]" />
      <Scribble type="flower" color="#91A78E" rotation={18} opacity={0.40} className="hidden sm:block absolute bottom-[12%] right-[6%]" />
      <Scribble type="arrow" color="#2E2B28" rotation={-6} opacity={0.30} className="hidden md:block absolute top-[44%] right-[34%]" />
      <Scribble type="cross" color="#3D2E25" rotation={10} opacity={0.30} className="hidden lg:block absolute top-[12%] left-[38%]" />
      <Scribble type="flourish" color="#7A6458" rotation={-4} opacity={0.35} className="hidden lg:block absolute bottom-[32%] right-[28%]" />
      <Scribble type="dots" color="#3D2E25" rotation={0} opacity={0.30} className="hidden md:block absolute top-[8%] right-[26%]" />

      {/* Group 1 — Paper System Notes (Tucked and Taped Overlaps) */}
      <PaperNote variant="cream" rotation={-6} className="hidden sm:block absolute top-[18%] right-[3%] z-12">
        Baked for you ♡
      </PaperNote>
      <PaperNote variant="kraft" rotation={4} className="hidden md:block absolute bottom-[12%] right-[16%] z-12">
        Fresh every morning
      </PaperNote>

      {/* Group 3 — Vintage Rubber Ink Stamps */}
      <VintageStamp text="SINCE 2019" variant="circle" rotation={12} opacity={0.35} className="absolute top-[5%] right-[6%] z-15" />
      <VintageStamp text="APPROVED" variant="rect" rotation={-10} opacity={0.35} className="hidden sm:block absolute bottom-[8%] right-[22%] z-15" />

      {/* Rule 20: Fasteners (ALWAYS Holding Paper Down) */}
      <WashiTape variant="beige" rotation={-10} className="absolute top-[2%] left-[8%] z-32" />
      <WashiTape variant="yellow" rotation={8} className="absolute top-[3%] right-[12%] z-32" />
      <WashiTape variant="pink" rotation={-6} className="absolute bottom-[4%] left-[12%] z-32" />
      <WashiTape variant="kraft" rotation={12} className="absolute top-[8%] right-[22%] z-32" />

      {/* Group 5 — Die-Cut Sticker Labels (Attached to Cheesecake Border) */}
      <Sticker text="sugar-free" variant="cyan" rotation={-4} scale={1.20} className="absolute top-[2%] right-[18%] z-38" />
      <Sticker text="lactose-free" variant="lime" rotation={3} scale={1.35} className="absolute top-1/2 right-[-4px] -translate-y-1/2 z-38" />
      <Sticker text="high-protein" variant="rose" rotation={-2} scale={1.25} className="absolute bottom-[6%] left-[8px] z-38" />
    </div>
  );
});

DoodleLayer.displayName = "DoodleLayer";
