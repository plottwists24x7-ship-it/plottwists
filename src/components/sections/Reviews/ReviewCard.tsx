import React from 'react';
import { ReviewItem } from './ReviewsData';
import { MaskingTape } from '@/components/paper/MaskingTape';

interface ReviewCardProps {
  item: ReviewItem;
  index: number;
}

// Unified Warm Ivory / Soft Cream Backdrop Color (#F5EFE6) across ALL cards
const UNIFIED_CREAM_BACKDROP = "#F5EFE6";

// Handcrafted Asymmetrical Abstract Paper Cutout SVG Contour
const UNIFIED_PAPER_CUTOUT_PATH = "M25,135 C15,65 50,15 125,20 C200,25 235,70 220,145 C205,220 170,275 105,270 C40,265 35,205 25,135 Z";

// 10 Rich Saturated Matte Cardstock Colors (Alternating Warm & Cool Tones)
const EDITORIAL_CARD_CONFIGS = [
  {
    bg: 'bg-[#0F7C7B]',        // 1. Deep Teal (Cool)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#85E3DD]', // Lighter Aqua Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#C46B3D]',        // 2. Burnt Orange (Warm)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#FFDAC1]', // Warm Peach Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#D9A62E]',        // 3. Mustard Yellow (Warm)
    text: 'text-[#2F221D]',    // Dark Brown Text
    subText: 'text-[#5C4010]', // Deep Gold Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#7FA97B]',        // 4. Sage Green (Cool)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#EBF5EA]', // Light Mint Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#D98B98]',        // 5. Dusty Rose (Warm)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#FFF0F2]', // Soft Pink Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#B85C38]',        // 6. Terracotta (Warm)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#FFE5D9]', // Peach Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#7B8B45]',        // 7. Olive Green (Cool)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#F4F6E9]', // Soft Olive Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#D8746C]',        // 8. Muted Coral (Warm)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#FDEDED]', // Soft Coral Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#5C86B8]',        // 9. Vintage Blue (Cool)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#EFF5FC]', // Ice Blue Accent
    border: 'border-[#2F221D]'
  },
  {
    bg: 'bg-[#7D5A7B]',        // 10. Plum (Cool)
    text: 'text-[#FFF8EE]',    // Warm Ivory Text
    subText: 'text-[#F6F0F6]', // Lavender Accent
    border: 'border-[#2F221D]'
  }
];

// 3 Tiny Paint Dot Colors (8px, 10px, 12px) for Scrapbook Signature
const PAINT_DOT_SETS = [
  ['#FF6B6B', '#FFE066', '#4ECDC4'],
  ['#EF5B5B', '#FFD166', '#06D6A0'],
  ['#FF85A1', '#FFC6FF', '#70D6FF'],
  ['#FFB703', '#FB8500', '#2A9D8F'],
  ['#E63946', '#F1FAEE', '#A8DADC']
];

// Scrapbook Bottom Left Labels
const SCRAPBOOK_LABELS = [
  '♡ Loved It',
  'Fresh Batch',
  'Customer Favorite',
  'Sweet Pick',
  'Made with Love',
  'Baked Fresh'
];

// Card Dimensions (300-340px Mobile / 440-460px Desktop) & Opposing Rotations
const CARD_VARIANTS = [
  { sizeClass: 'w-[300px] xs:w-[340px] sm:w-[440px] md:w-[460px] h-[250px] xs:h-[270px] sm:h-[290px]', rotClass: 'rotate-[-2deg]', photoRotClass: 'rotate-[3deg]', tapeRot: -10 },
  { sizeClass: 'w-[295px] xs:w-[335px] sm:w-[435px] md:w-[455px] h-[245px] xs:h-[265px] sm:h-[285px]', rotClass: 'rotate-[1deg]', photoRotClass: 'rotate-[-3deg]', tapeRot: 8 },
  { sizeClass: 'w-[305px] xs:w-[345px] sm:w-[445px] md:w-[460px] h-[252px] xs:h-[272px] sm:h-[292px]', rotClass: 'rotate-[2deg]', photoRotClass: 'rotate-[-2deg]', tapeRot: -12 },
  { sizeClass: 'w-[298px] xs:w-[338px] sm:w-[438px] md:w-[458px] h-[248px] xs:h-[268px] sm:h-[288px]', rotClass: 'rotate-[-1deg]', photoRotClass: 'rotate-[4deg]', tapeRot: 14 },
  { sizeClass: 'w-[302px] xs:w-[342px] sm:w-[442px] md:w-[462px] h-[250px] xs:h-[270px] sm:h-[290px]', rotClass: 'rotate-[3deg]', photoRotClass: 'rotate-[-3deg]', tapeRot: -8 }
];

const TAPE_COLORS: Array<'pink' | 'sage' | 'yellow' | 'blue' | 'cream' | 'kraft'> = ['pink', 'yellow', 'sage', 'blue', 'cream', 'kraft'];

export const ReviewCard: React.FC<ReviewCardProps> = React.memo(({ item, index }) => {
  const cardConfig = EDITORIAL_CARD_CONFIGS[index % EDITORIAL_CARD_CONFIGS.length];
  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
  const dotColors = PAINT_DOT_SETS[index % PAINT_DOT_SETS.length];
  const labelText = SCRAPBOOK_LABELS[index % SCRAPBOOK_LABELS.length];

  return (
    <article
      className={`${variant.sizeClass} shrink-0 ${cardConfig.bg} ${cardConfig.border} border-[3.5px] sm:border-[4px] shadow-[6px_6px_0_#2F221D] sm:shadow-[8px_8px_0_#2F221D] rounded-[22px] sm:rounded-[26px] p-4 xs:p-5 sm:p-7 relative transform ${variant.rotClass} hover:rotate-0 hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-[12px_12px_0_#2F221D] transition-all duration-300 ease-out cursor-pointer z-10 hover:z-30 select-none flex items-center justify-between group overflow-visible`}
    >
      {/* Top Washed Washi Tape Accent */}
      <MaskingTape 
        color={tapeColor} 
        width={50} 
        height={16} 
        rotate={variant.tapeRot} 
        className="absolute -top-3.5 left-6 sm:left-10 z-20 opacity-90 pointer-events-none" 
      />

      {/* TOP RIGHT: Micro SVG Scrapbook Decoration */}
      <div className="absolute top-3.5 right-4 sm:right-6 opacity-75 pointer-events-none">
        {index % 4 === 0 && (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFE066]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )}
        {index % 4 === 1 && (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
          </svg>
        )}
        {index % 4 === 2 && (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 -rotate-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 32">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8v14a5 5 0 0010 0V6a3 3 0 00-6 0v14a1 1 0 002 0V8" />
          </svg>
        )}
        {index % 4 === 3 && (
          <span className="font-fasthand text-[10px] sm:text-xs font-bold text-white/90 rotate-[-6deg] inline-block border border-dashed border-white/80 px-1.5 py-0.5 rounded bg-black/20">
            Fresh!
          </span>
        )}
      </div>

      {/* LEFT COLUMN: 60% Width Text Content */}
      <div className="w-[58%] sm:w-[60%] shrink-0 pr-1.5 sm:pr-2 flex flex-col justify-between h-full py-0.5 sm:py-1">
        <div>
          {/* STEP 1: TOP LEFT - ★★★★★ Rating Stars */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
            {[...Array(item.rating || 5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#FFE066] fill-current filter drop-shadow-[0.5px_0.5px_0_#2F221D]" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className={`font-fasthand text-xs font-bold ${cardConfig.subText} ml-1`}>♡</span>
          </div>

          {/* STEP 2: Customer Name (Adaptive High Contrast Text) */}
          <cite className={`font-fraunces text-base xs:text-lg sm:text-2xl font-bold ${cardConfig.text} not-italic tracking-tight block mb-1 sm:mb-2 filter drop-shadow-[0.5px_0.5px_0_rgba(0,0,0,0.15)]`}>
            {item.name}
          </cite>

          {/* STEP 3: Review Text in Mali (Adaptive Text Color) */}
          <blockquote className={`font-mali text-[11px] xs:text-xs sm:text-sm ${cardConfig.text} font-semibold leading-[1.5] sm:leading-[1.65] line-clamp-3 sm:line-clamp-4`}>
            &ldquo;{item.review}&rdquo;
          </blockquote>
        </div>

        {/* STEP 4: BOTTOM LEFT Scrapbook Label */}
        <div className="flex items-center gap-1 pt-1.5 sm:pt-2">
          <span className={`font-fasthand text-[11px] sm:text-sm font-bold ${cardConfig.subText}`}>
            {labelText}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: 40% Width Hero Customer Photo Frame & Unified Warm Cream Abstract Backdrop */}
      <div className="w-[42%] sm:w-[40%] h-full relative flex items-center justify-end pointer-events-none pr-1">
        
        {/* Photo Container wrapper centered with UNIFIED Warm Ivory (#F5EFE6) Abstract Paper Cutout Backdrop */}
        <div className="relative -bottom-2 sm:-bottom-3.5 -right-2 sm:-right-3.5 z-10">
          
          {/* Unified Warm Ivory (#F5EFE6) Abstract Paper Shape (120-130% W, 110-120% H centered behind portrait) */}
          <div className="absolute -inset-4 sm:-inset-7 flex items-center justify-center -z-10 transform group-hover:scale-105 transition-transform duration-300 opacity-98 pointer-events-none">
            <svg viewBox="0 0 240 280" className="w-[145%] h-[145%] filter drop-shadow-[3px_4px_0_rgba(0,0,0,0.22)]">
              <path d={UNIFIED_PAPER_CUTOUT_PATH} fill={UNIFIED_CREAM_BACKDROP} />
            </svg>
          </div>

          {/* Customer Polaroid Photo Frame */}
          <div className={`w-24 h-28 xs:w-28 xs:h-32 sm:w-36 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden border-[2.5px] sm:border-[3.5px] border-white bg-[#FAF4E8] shadow-[4px_4px_0_rgba(0,0,0,0.25)] sm:shadow-[6px_6px_0_rgba(0,0,0,0.25)] transform ${variant.photoRotClass} group-hover:rotate-0 transition-transform duration-300 relative z-10`}>
            <img 
              src={item.portrait} 
              alt={item.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Masking Tape holding top corner of Photo */}
          <MaskingTape color="kraft" width={32} height={12} rotate={-14} className="absolute -top-2.5 left-1 z-20 opacity-90 pointer-events-none" />

          {/* THREE TINY COLORED PAINT DOTS OVERLAPPING PHOTO & BACKDROP (8px, 10px, 12px) */}
          <div className="absolute -bottom-2 -right-2 z-20 flex items-center gap-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 pointer-events-none">
            <span className="w-2 h-2 rounded-full border border-[#2F221D]/50 shadow-sm inline-block" style={{ backgroundColor: dotColors[0] }} />
            <span className="w-2.5 h-2.5 rounded-full border border-[#2F221D]/50 shadow-sm inline-block -translate-y-1" style={{ backgroundColor: dotColors[1] }} />
            <span className="w-3 h-3 rounded-full border border-[#2F221D]/50 shadow-sm inline-block" style={{ backgroundColor: dotColors[2] }} />
          </div>

        </div>

      </div>
    </article>
  );
});

ReviewCard.displayName = 'ReviewCard';






