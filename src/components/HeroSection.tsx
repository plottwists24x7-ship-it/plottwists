import { MaskingTape } from '@/components/paper/MaskingTape'

interface HeroSectionProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
}

export function HeroSection({ onExploreClick, onStoryClick }: HeroSectionProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center relative select-none">
      {/* Top Tape Label - FRESH. HONEST. WHOLESOME. (Visually hugs headline, reduced width ~25%) */}
      <div className="relative inline-block mb-5 -ml-1">
        <MaskingTape color="pink" width={40} height={20} rotate={-9} className="absolute -top-2 -left-3 z-10" />
        <div className="bg-[#EFE6CE] border-2 border-[#3B2A22] px-4 py-1.5 rotate-[-2.3deg] shadow-[3px_3px_0_rgba(59,42,34,0.15)] inline-block">
          <p className="text-[11px] md:text-xs font-bold tracking-[0.18em] text-[#3B2A22] font-manrope">
            FRESH. HONEST. WHOLESOME.
          </p>
        </div>
      </div>

      {/* Decorative sparkle */}
      <svg className="absolute -top-2 -left-4 w-6 h-6 text-[#3B2A22] opacity-75 animate-paper-float pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
      </svg>

      {/* Main Tagline - Stacked Text Boxes (10-12% larger typography, refined rhythm) */}
      <div className="space-y-4 md:space-y-5">
        {/* A NEW */}
        <div className="relative inline-block">
          {/* Hand-drawn star doodle */}
          <svg className="absolute -top-6 -left-6 w-7 h-7 text-[#3B2A22] opacity-80 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
          </svg>
          
          <div className="bg-[#F5EDDC] border-[3px] border-[#3B2A22] px-7 md:px-9 py-3.5 md:py-4 shadow-[6px_6px_0_#3B2A22] transform -rotate-[1.4deg] inline-block transition-transform duration-300 hover:scale-[1.01]">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#3B2A22] tracking-wider leading-none">
              A NEW
            </h1>
          </div>
        </div>

        {/* TASTE + OF badge */}
        <div className="relative inline-flex items-end">
          <div className="bg-[#EF5B5B] border-[3px] border-[#3B2A22] px-7 md:px-9 py-3.5 md:py-4 shadow-[6px_6px_0_rgba(59,42,34,0.25)] transform rotate-[1.2deg] inline-block">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#F5EDDC] tracking-wider leading-none">
              TASTE
            </h2>
          </div>

          {/* OF Badge - Yellow Circle with hand-placed 7° rotation and offset */}
          <div className="absolute -bottom-4 -right-6 md:-bottom-5 md:-right-8 w-16 h-16 md:w-20 md:h-20 bg-[#FFE066] rounded-full border-[3px] border-[#3B2A22] shadow-[3px_3px_0_rgba(59,42,34,0.25)] flex items-center justify-center z-20 transform rotate-[7deg] animate-paper-wobble">
            <p className="text-lg md:text-xl font-cherry font-bold text-[#3B2A22]">OF</p>
          </div>
        </div>

        {/* WELLNESS */}
        <div className="relative inline-block">
          <div className="bg-[#F5EDDC] border-[3px] border-[#3B2A22] px-7 md:px-9 py-3.5 md:py-4 shadow-[6px_6px_0_rgba(59,42,34,0.25)] transform -rotate-[2.3deg] inline-block">
            <h3 className="text-6xl sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#3B2A22] tracking-wider leading-none">
              WELLNESS
            </h3>
          </div>
          {/* Squiggle underline */}
          <svg className="absolute -bottom-3 left-4 w-28 h-6 text-[#3B2A22] opacity-75 pointer-events-none" fill="none" viewBox="0 0 100 24">
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M2 12 Q 15 2, 28 12 T 54 12 T 80 12 T 98 12" />
          </svg>
        </div>
      </div>

      {/* Subheading (Increased line-height and max-width) */}
      <p className="text-base md:text-lg text-[#3B2A22] max-w-lg mt-8 leading-[1.75] font-manrope font-medium">
        Guilt-free treats made with better ingredients for{' '}
        <span className="relative inline-block font-bold">
          a happier you.
          <span className="absolute left-0 -bottom-0.5 w-full h-2.5 bg-[#8FB3A1] opacity-60 -z-10 rounded-sm" />
        </span>
      </p>

      {/* CTA Buttons (Strict visual hierarchy: Dominant Explore Bakes vs Quieter Read Story) */}
      <div className="flex flex-wrap items-center gap-5 mt-9">
        {/* Primary CTA - Visually dominant (+15-20% scale, rich shadow & paper press effect) */}
        <button 
          onClick={onExploreClick}
          className="px-8 md:px-9 py-4 md:py-4.5 bg-[#EF5B5B] text-white text-base md:text-lg font-manrope font-bold rounded-xl border-[3px] border-[#3B2A22] shadow-[5px_5px_0_#3B2A22] hover:shadow-[7px_7px_0_#3B2A22] hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#3B2A22] active:scale-[0.98] transition-all duration-250 ease-out flex items-center gap-3.5 cursor-pointer group" 
        >
          <span>EXPLORE BAKES</span>
          <div className="w-8 h-8 rounded-full bg-[#FFE066] border-2 border-[#3B2A22] flex items-center justify-center group-hover:rotate-8 transition-transform duration-250 ease-out" aria-hidden="true">
            <svg className="w-4 h-4 text-[#3B2A22]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9z" />
            </svg>
          </div>
        </button>

        {/* Secondary CTA - Quieter, lighter visual treatment */}
        <button 
          onClick={onStoryClick}
          className="px-6 md:px-7 py-3.5 md:py-4 bg-white/85 text-[#3B2A22] text-sm md:text-base font-manrope font-bold rounded-xl border-2 border-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:bg-white hover:shadow-[5px_5px_0_#3B2A22] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#3B2A22] active:scale-[0.98] transition-all duration-250 ease-out flex items-center gap-2.5 cursor-pointer group" 
        >
          <span>READ OUR STORY</span>
          <svg className="w-4 h-4 text-[#3B2A22] group-hover:translate-x-1 group-hover:rotate-6 transition-transform duration-250 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Corner scribble - top left */}
      <div className="absolute -top-6 left-1/3 w-16 h-10 pointer-events-none">
        <svg className="w-full h-full text-[#2D1810] opacity-30" fill="none" viewBox="0 0 64 40" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" d="M4 4 L4 20 M12 4 L12 20 M2 4 L14 4" />
        </svg>
      </div>
    </div>
  )
}
