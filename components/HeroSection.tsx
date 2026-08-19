import { MaskingTape } from '@/components/paper/MaskingTape'

interface HeroSectionProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
}

export function HeroSection({ onExploreClick, onStoryClick }: HeroSectionProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center relative">
      {/* Tape label - FRESH. HONEST. WHOLESOME. */}
      <div className="relative inline-block mb-6 -ml-1">
        <MaskingTape color="pink" width={44} height={22} rotate={-9} className="absolute -top-2 -left-3 z-10" />
        <div className="bg-[#EFE6CE] border-2 border-[#2D1810] px-5 py-2 rotate-[-2.3deg] shadow-[3px_3px_0_rgba(45,24,16,0.15)]">
          <p className="text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#2D1810]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            FRESH. HONEST. WHOLESOME.
          </p>
        </div>
      </div>

      {/* Decorative sparkle */}
      <svg className="absolute top-8 -left-2 w-6 h-6 text-[#2D1810] animate-paper-float" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
      </svg>

      {/* Main tagline - stacked text boxes */}
      <div className="space-y-3">
        {/* A NEW */}
        <div className="relative inline-block">
          <div className="bg-[#F5EDDC] border-[3px] border-[#2D1810] px-6 py-3 shadow-[5px_5px_0_rgba(45,24,16,0.2)] transform -rotate-[1.4deg] inline-block">
            <h1 className="text-6xl md:text-7xl font-black text-[#2D1810] tracking-tight" style={{ fontFamily: "'Fredoka', sans-serif", lineHeight: '1' }}>
              A NEW
            </h1>
          </div>
        </div>

        {/* TASTE + OF badge */}
        <div className="relative inline-flex items-end">
          <div className="bg-[#EF5B5B] border-[3px] border-[#2D1810] px-6 py-3 shadow-[5px_5px_0_rgba(45,24,16,0.2)] transform rotate-[1.2deg] inline-block">
            <h2 className="text-6xl md:text-7xl font-black text-[#F5EDDC] tracking-tight" style={{ fontFamily: "'Fredoka', sans-serif", lineHeight: '1' }}>
              TASTE
            </h2>
          </div>
          {/* OF badge - yellow circle, overlapping bottom-right of TASTE */}
          <div className="absolute -bottom-4 -right-6 w-16 h-16 md:w-20 md:h-20 bg-[#FFE066] rounded-full border-[3px] border-[#2D1810] shadow-[3px_3px_0_rgba(45,24,16,0.2)] flex items-center justify-center z-10 animate-paper-wobble">
            <p className="text-lg md:text-xl font-black text-[#2D1810]" style={{ fontFamily: "'Fredoka', sans-serif" }}>OF</p>
          </div>
        </div>

        {/* WELLNESS */}
        <div className="relative inline-block">
          <div className="bg-[#F5EDDC] border-[3px] border-[#2D1810] px-6 py-3 shadow-[5px_5px_0_rgba(45,24,16,0.2)] transform -rotate-[2.3deg] inline-block">
            <h3 className="text-6xl md:text-7xl font-black text-[#2D1810] tracking-tight" style={{ fontFamily: "'Fredoka', sans-serif", lineHeight: '1' }}>
              WELLNESS
            </h3>
          </div>
          {/* Squiggle underline */}
          <svg className="absolute -bottom-3 left-4 w-24 h-6 text-[#2D1810] opacity-70" fill="none" viewBox="0 0 100 24">
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M2 12 Q 15 2, 28 12 T 54 12 T 80 12 T 98 12" />
          </svg>
        </div>
      </div>

      {/* Subheading */}
      <p className="text-base md:text-lg text-[#2D1810] max-w-md mt-10 leading-relaxed font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Guilt-free treats made with better ingredients for{' '}
        <span className="relative inline-block font-bold">
          a happier you.
          <span className="absolute left-0 -bottom-0.5 w-full h-2 bg-[#8FB3A1] opacity-50 -z-10" />
        </span>
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 mt-10">
        <button 
          onClick={onExploreClick}
          className="px-6 py-3.5 bg-[#EF5B5B] text-white text-sm md:text-base font-bold rounded-lg border-2 border-[#2D1810] shadow-[3px_3px_0_rgba(45,24,16,0.3)] hover:shadow-[4px_4px_0_rgba(45,24,16,0.3)] hover:-translate-y-0.5 hover:bg-[#E54545] transition-all flex items-center gap-3 cursor-pointer" 
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <span>EXPLORE BAKES</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <button 
          onClick={onStoryClick}
          className="px-6 py-3.5 bg-[#F5EDDC] text-[#2D1810] text-sm md:text-base font-bold rounded-lg border-2 border-[#2D1810] shadow-[3px_3px_0_rgba(45,24,16,0.3)] hover:shadow-[4px_4px_0_rgba(45,24,16,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-3 cursor-pointer" 
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <span>READ OUR STORY</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Corner scribble - top left */}
      <div className="absolute -top-6 left-1/3 w-16 h-10 pointer-events-none">
        <svg className="w-full h-full text-[#2D1810] opacity-40" fill="none" viewBox="0 0 64 40" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" d="M4 4 L4 20 M12 4 L12 20 M2 4 L14 4" />
        </svg>
      </div>
    </div>
  )
}
