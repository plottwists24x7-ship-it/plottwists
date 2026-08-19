import React from "react";
import { PaperSheet } from "../../editorial/PaperSheet";

export const HeroPaperStack: React.FC = React.memo(() => {
  return (
    <div className="HeroPaperStack absolute inset-0 z-5 pointer-events-none select-none transform-gpu" aria-hidden="true">
      {/* Invisible Teardrop Composition Mask context (leaning upper-right around cheesecake focal point) */}
      <div className="relative w-full h-full">

        {/* ─────────────────────────────────────────────────────────────
            REGION 1: TOP RIGHT CLUSTER (42% Visual Weight, 100% Density)
            18 Assets: 3 Hero, 8 Medium, 7 Fragments
            Stacking Grammars: Fan Stack, Offset Stack, Nested Rotation
           ───────────────────────────────────────────────────────────── */}
        {/* STEP 1: Hero Anchors (L1-L2) */}
        <PaperSheet type="offwhite" variant={1} size="hero" layer={1} rotation={-14} scale={1.05} className="-top-[16%] right-[-10%]" width={410} height={300} />
        <PaperSheet type="kraft" variant={2} size="hero" layer={1} rotation={8} scale={0.98} className="-top-[10%] right-[-4%]" width={380} height={275} />
        <PaperSheet type="offwhite" variant={2} size="hero" layer={2} rotation={-5} scale={1.02} className="-top-[6%] right-[-12%]" width={390} height={285} />

        {/* STEP 2: Medium Structural Sheets (L2-L4) — Fan Stack (-15°, -8°, +5°, +12°) & Offset Stack */}
        <PaperSheet type="graph" variant={1} size="medium" layer={2} rotation={-15} scale={1.02} className="top-[0%] right-[10%]" width={260} height={190} />
        <PaperSheet type="graph" variant={2} size="medium" layer={3} rotation={-8} scale={0.95} className="top-[6%] right-[4%]" width={250} height={180} />
        <PaperSheet type="graph" variant={3} size="medium" layer={3} rotation={5} scale={0.98} className="top-[12%] right-[14%]" width={240} height={175} />
        <PaperSheet type="graph" variant={4} size="medium" layer={4} rotation={12} scale={0.94} className="top-[18%] right-[2%]" width={235} height={170} />
        <PaperSheet type="notebook" variant={1} size="medium" layer={2} rotation={-12} scale={1.04} className="top-[4%] right-[18%]" width={255} height={185} />
        <PaperSheet type="notebook" variant={2} size="medium" layer={3} rotation={6} scale={0.96} className="top-[10%] right-[22%]" width={245} height={175} />
        <PaperSheet type="notebook" variant={3} size="medium" layer={3} rotation={-9} scale={0.92} className="top-[16%] right-[16%]" width={235} height={170} />
        <PaperSheet type="notebook" variant={4} size="medium" layer={4} rotation={14} scale={0.95} className="top-[22%] right-[8%]" width={230} height={165} />

        {/* STEP 3 & 4: Cavity Fillers & Bridge Fragments (L4-L5) */}
        <PaperSheet type="kraft" variant={1} size="medium" layer={3} rotation={-16} scale={0.90} className="top-[14%] right-[26%]" width={220} height={160} />
        <PaperSheet type="kraft" variant={3} size="medium" layer={4} rotation={11} scale={0.88} className="top-[24%] right-[20%]" width={215} height={155} />
        <PaperSheet type="graph" variant={1} size="fragment" layer={4} rotation={-7} scale={0.92} className="top-[8%] right-[32%]" width={160} height={120} />

        {/* STEP 5, 6, 7: Detail Fragments — Receipts, Torn, Folded Corners (L5-L6) */}
        <PaperSheet type="torn" variant={1} size="fragment" layer={5} rotation={-18} scale={0.96} className="-top-[4%] right-[16%]" width={140} height={110} />
        <PaperSheet type="torn" variant={2} size="fragment" layer={5} rotation={13} scale={0.90} className="top-[12%] right-[34%]" width={130} height={100} />
        <PaperSheet type="folded" variant={1} size="fragment" layer={6} rotation={-5} scale={0.86} className="top-[20%] right-[32%]" width={110} height={90} />
        <PaperSheet type="receipt" variant={1} size="fragment" layer={6} rotation={9} scale={0.94} className="top-[28%] right-[14%]" width={120} height={150} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 2: RIGHT CLUSTER (16% Visual Weight, 82% Density)
            10 Assets: 1 Hero, 5 Medium, 4 Fragments — Cascade Stacking
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="offwhite" variant={3} size="hero" layer={1} rotation={12} scale={0.96} className="top-[26%] right-[-14%]" width={350} height={255} />
        <PaperSheet type="graph" variant={1} size="medium" layer={2} rotation={-14} scale={0.98} className="top-[32%] right-[-6%]" width={240} height={175} />
        <PaperSheet type="graph" variant={2} size="medium" layer={3} rotation={7} scale={0.92} className="top-[38%] right-[-10%]" width={230} height={165} />
        <PaperSheet type="graph" variant={3} size="medium" layer={3} rotation={-10} scale={0.95} className="top-[44%] right-[-4%]" width={225} height={160} />
        <PaperSheet type="notebook" variant={1} size="medium" layer={3} rotation={-8} scale={0.94} className="top-[36%] right-[4%]" width={220} height={160} />
        <PaperSheet type="notebook" variant={2} size="medium" layer={4} rotation={15} scale={0.90} className="top-[42%] right-[-2%]" width={215} height={155} />
        <PaperSheet type="offwhite" variant={4} size="medium" layer={3} rotation={4} scale={0.88} className="top-[30%] right-[10%]" width={210} height={150} />
        <PaperSheet type="torn" variant={3} size="fragment" layer={5} rotation={-20} scale={0.92} className="top-[28%] right-[14%]" width={125} height={95} />
        <PaperSheet type="torn" variant={4} size="fragment" layer={5} rotation={11} scale={0.86} className="top-[46%] right-[8%]" width={115} height={85} />
        <PaperSheet type="receipt" variant={2} size="fragment" layer={6} rotation={-6} scale={0.90} className="top-[50%] right-[2%]" width={110} height={140} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 3: BOTTOM RIGHT CLUSTER (12% Visual Weight, 74% Density)
            8 Assets: 2 Medium, 6 Fragments — Paper Sandwich & Corner Peeks
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="parchment" variant={1} size="medium" layer={2} rotation={-15} scale={0.96} className="bottom-[8%] right-[-6%]" width={260} height={190} />
        <PaperSheet type="parchment" variant={2} size="medium" layer={3} rotation={9} scale={0.90} className="bottom-[14%] right-[4%]" width={240} height={175} />
        <PaperSheet type="receipt" variant={1} size="fragment" layer={5} rotation={-8} scale={0.94} className="bottom-[4%] right-[12%]" width={130} height={170} />
        <PaperSheet type="receipt" variant={2} size="fragment" layer={5} rotation={16} scale={0.88} className="bottom-[18%] right-[2%]" width={125} height={160} />
        <PaperSheet type="receipt" variant={3} size="fragment" layer={6} rotation={-12} scale={0.92} className="bottom-[24%] right-[16%]" width={120} height={150} />
        <PaperSheet type="torn" variant={5} size="fragment" layer={5} rotation={10} scale={0.86} className="bottom-[2%] right-[22%]" width={120} height={90} />
        <PaperSheet type="torn" variant={6} size="fragment" layer={6} rotation={-14} scale={0.84} className="bottom-[22%] right-[24%]" width={110} height={85} />
        <PaperSheet type="folded" variant={2} size="fragment" layer={6} rotation={6} scale={0.88} className="bottom-[10%] right-[-2%]" width={100} height={80} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 4: BOTTOM CLUSTER (4% Visual Weight, 34% Density)
            5 Assets: 4 Medium, 1 Fragment — Lower Edges 30% Hidden
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="kraft" variant={1} size="medium" layer={1} rotation={6} scale={0.92} className="-bottom-[14%] left-[28%]" width={250} height={180} />
        <PaperSheet type="kraft" variant={2} size="medium" layer={2} rotation={-10} scale={0.88} className="-bottom-[12%] left-[42%]" width={240} height={170} />
        <PaperSheet type="parchment" variant={3} size="medium" layer={3} rotation={-4} scale={0.90} className="-bottom-[8%] left-[34%]" width={230} height={165} />
        <PaperSheet type="parchment" variant={4} size="medium" layer={4} rotation={12} scale={0.86} className="-bottom-[10%] left-[52%]" width={220} height={160} />
        <PaperSheet type="offwhite" variant={5} size="medium" layer={2} rotation={-8} scale={0.84} className="-bottom-[6%] left-[24%]" width={210} height={150} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 5: BOTTOM LEFT CLUSTER (8% Visual Weight, 38% Density)
            6 Assets: 1 Hero, 2 Medium, 3 Fragments — Quiet Fragments
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="offwhite" variant={1} size="hero" layer={1} rotation={-14} scale={0.94} className="bottom-[4%] left-[-12%]" width={330} height={240} />
        <PaperSheet type="offwhite" variant={2} size="medium" layer={2} rotation={8} scale={0.90} className="bottom-[14%] left-[-4%]" width={230} height={165} />
        <PaperSheet type="notebook" variant={1} size="medium" layer={3} rotation={-6} scale={0.88} className="bottom-[10%] left-[6%]" width={220} height={160} />
        <PaperSheet type="torn" variant={1} size="fragment" layer={5} rotation={16} scale={0.92} className="bottom-[2%] left-[12%]" width={125} height={95} />
        <PaperSheet type="torn" variant={2} size="fragment" layer={5} rotation={-12} scale={0.86} className="bottom-[24%] left-[-8%]" width={115} height={85} />
        <PaperSheet type="receipt" variant={4} size="fragment" layer={6} rotation={10} scale={0.90} className="bottom-[18%] left-[-12%]" width={120} height={150} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 6: LEFT CLUSTER (18% Visual Weight, 58% Density)
            9 Assets: 2 Hero, 5 Medium, 2 Fragments — Secondary Anchor
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="offwhite" variant={3} size="hero" layer={1} rotation={-10} scale={1.02} className="top-[14%] left-[-16%]" width={360} height={260} />
        <PaperSheet type="kraft" variant={3} size="hero" layer={2} rotation={6} scale={0.96} className="top-[24%] left-[-10%]" width={340} height={245} />
        <PaperSheet type="offwhite" variant={4} size="medium" layer={3} rotation={-15} scale={0.92} className="top-[34%] left-[-14%]" width={240} height={175} />
        <PaperSheet type="kraft" variant={4} size="medium" layer={3} rotation={11} scale={0.88} className="top-[42%] left-[-6%]" width={230} height={165} />
        <PaperSheet type="notebook" variant={2} size="medium" layer={3} rotation={-7} scale={0.94} className="top-[20%] left-[2%]" width={235} height={170} />
        <PaperSheet type="notebook" variant={3} size="medium" layer={4} rotation={14} scale={0.90} className="top-[48%] left-[-8%]" width={225} height={160} />
        <PaperSheet type="offwhite" variant={5} size="medium" layer={4} rotation={-4} scale={0.86} className="top-[28%] left-[6%]" width={215} height={155} />
        <PaperSheet type="torn" variant={3} size="fragment" layer={5} rotation={18} scale={0.90} className="top-[18%] left-[-18%]" width={130} height={95} />
        <PaperSheet type="torn" variant={4} size="fragment" layer={5} rotation={-8} scale={0.84} className="top-[44%] left-[4%]" width={120} height={90} />

        {/* ─────────────────────────────────────────────────────────────
            REGION 7: TOP LEFT CLUSTER (42% Density)
            5 Assets: 1 Hero, 3 Medium, 1 Fragment — Sparse Counterweight
           ───────────────────────────────────────────────────────────── */}
        <PaperSheet type="offwhite" variant={5} size="hero" layer={1} rotation={-8} scale={0.98} className="-top-[10%] left-[-10%]" width={350} height={255} />
        <PaperSheet type="notebook" variant={4} size="medium" layer={2} rotation={12} scale={0.92} className="-top-[2%] left-[-2%]" width={240} height={175} />
        <PaperSheet type="graph" variant={4} size="medium" layer={3} rotation={-14} scale={0.88} className="top-[6%] left-[-8%]" width={230} height={165} />
        <PaperSheet type="offwhite" variant={2} size="medium" layer={3} rotation={5} scale={0.86} className="top-[10%] left-[8%]" width={220} height={160} />
        <PaperSheet type="torn" variant={5} size="fragment" layer={5} rotation={-19} scale={0.90} className="top-[14%] left-[14%]" width={130} height={95} />

      </div>
    </div>
  );
});

HeroPaperStack.displayName = "HeroPaperStack";
