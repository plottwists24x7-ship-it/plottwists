import { MaskingTape } from '@/components/paper/MaskingTape'
import { StickyNote } from '@/components/paper/StickyNote'
import { TornPaper } from '@/components/paper/TornPaper'

const CandyWrapperDoodle = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-80`} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12 L4 6 L6 18 Z" />
    <path d="M24 24 L32 18 L30 30 Z" />
    <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(-15 18 18)" />
    <line x1="14" y1="14" x2="22" y2="22" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

const PencilHeartDoodle = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-80`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M8 9 Q 12 13 16 9" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

const PencilStarDoodle = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-80`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 Q12 12 2 12 Q12 12 12 22 Q12 12 22 12 Q12 12 12 2 Z" />
  </svg>
);

export function DecorativeElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
      {/* Ink-dot scatter, top right corner */}
      <div className="absolute top-0 right-0 w-40 h-40 dot-scatter opacity-70" style={{ maskImage: 'radial-gradient(circle at top right, black, transparent 70%)' }} />
      <div className="absolute top-0 left-0 w-28 h-28 dot-scatter opacity-40" style={{ maskImage: 'radial-gradient(circle at top left, black, transparent 70%)' }} />

      {/* ---- FLOATING PENCIL SCRIBBLED HEARTS ♡ ---- */}
      <div className="absolute top-[14%] left-[12%] animate-paper-float z-10">
        <PencilHeartDoodle className="w-8 h-8" />
      </div>

      <div className="absolute top-[22%] right-[18%] animate-paper-float z-10" style={{ animationDelay: '1.2s' }}>
        <PencilHeartDoodle className="w-7 h-7 rotate-[12deg]" />
      </div>

      <div className="absolute top-[50%] left-[6%] animate-paper-float z-10" style={{ animationDelay: '2.4s' }}>
        <PencilHeartDoodle className="w-6 h-6 rotate-[-10deg]" />
      </div>

      <div className="absolute bottom-[28%] right-[15%] animate-paper-float z-10" style={{ animationDelay: '0.8s' }}>
        <PencilHeartDoodle className="w-7 h-7 rotate-[8deg]" />
      </div>

      {/* ---- FLOATING PENCIL CELEBRATION CANDY WRAPPERS 🍬 ---- */}
      <div className="absolute top-[18%] left-[28%] animate-paper-wobble z-10">
        <CandyWrapperDoodle className="w-9 h-9 rotate-[-15deg]" />
      </div>

      <div className="absolute top-[42%] right-[22%] animate-paper-wobble z-10" style={{ animationDelay: '1.5s' }}>
        <CandyWrapperDoodle className="w-8 h-8 rotate-[20deg]" />
      </div>

      <div className="absolute bottom-[18%] left-[32%] animate-paper-wobble z-10" style={{ animationDelay: '2.8s' }}>
        <CandyWrapperDoodle className="w-9 h-9 rotate-[-8deg]" />
      </div>

      {/* ---- FLOATING PENCIL SPARKLE STARS ✨ ---- */}
      <div className="absolute top-[12%] right-[12%] animate-paper-wobble z-10">
        <PencilStarDoodle className="w-8 h-8" />
      </div>

      <div className="absolute top-[32%] left-[18%] text-[#3B2A22] opacity-75 animate-paper-float z-10">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      </div>

      {/* ---- Masking tape system: 12 pieces scattered, "holding" nearby paper ---- */}
      <MaskingTape color="pink" width={70} height={20} rotate={-10} className="absolute top-[9%] left-[7%]" />
      <MaskingTape color="sage" width={90} height={22} rotate={-4} className="absolute top-[6%] right-[30%]" />
      <MaskingTape color="yellow" width={80} height={20} rotate={12} className="absolute top-[22%] right-[26%]" />
      <MaskingTape color="blue" width={70} height={18} rotate={6} className="absolute top-[30%] left-[38%]" />
      <MaskingTape color="cream" width={64} height={18} rotate={-14} className="absolute top-[44%] right-[8%]" />
      <MaskingTape color="kraft" width={78} height={20} rotate={9} className="absolute bottom-[30%] left-[20%]" />
      <MaskingTape color="sage" width={60} height={16} rotate={-6} className="absolute bottom-[22%] right-[36%]" />
      <MaskingTape color="pink" width={72} height={18} rotate={4} className="absolute bottom-[38%] left-[44%]" />
      <MaskingTape color="yellow" width={66} height={18} rotate={-9} className="absolute top-[16%] left-[24%]" />
      <MaskingTape color="blue" width={58} height={16} rotate={14} className="absolute bottom-[14%] left-[10%]" />
      <MaskingTape color="cream" width={68} height={18} rotate={-3} className="absolute top-[38%] left-[6%]" />
      <MaskingTape color="kraft" width={60} height={16} rotate={7} className="absolute bottom-[46%] right-[18%]" />

      {/* ---- Small sticky notes scattered for density ---- */}
      <StickyNote text="Chef's Pick" color="sage" size={72} rotate={-8} className="absolute top-[52%] left-[3%]" />
      <StickyNote text="Baked Today" color="pink" size={72} rotate={6} className="absolute top-[8%] left-[44%]" />
      <StickyNote text="Recipe #12" color="cream" size={68} rotate={-4} className="absolute bottom-[8%] right-[42%]" />

      {/* Curved arrow, near CTA area */}
      <svg className="absolute bottom-[33%] left-[38%] w-10 h-10 text-[#2D1810] opacity-40" fill="none" viewBox="0 0 40 40" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth="2" d="M30 6 Q10 6 8 22 M8 22 l-4 -6 M8 22 l7 -3" />
      </svg>

      {/* Paperclip near bottom-left card stack */}
      <svg className="absolute bottom-[24%] left-[46%] w-6 h-8 text-[#2D1810] opacity-50 -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 32">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 8v14a5 5 0 0010 0V6a3 3 0 00-6 0v14a1 1 0 002 0V8" />
      </svg>

      {/* Extra torn paper scraps for layered depth behind the fold */}
      <TornPaper variant="notebook" rotate={-5} edge={2} className="absolute top-[60%] right-[12%] w-20 h-14 opacity-70" />
      <TornPaper variant="recipe" rotate={8} edge={0} className="absolute top-[18%] right-[6%] w-16 h-20 opacity-60" />

      {/* Since 2019 stamp - bottom left corner */}
      <div className="absolute bottom-6 left-6 w-20 h-20 bg-white rounded-full border-[3px] border-[#2D1810] flex flex-col items-center justify-center shadow-[3px_3px_0_rgba(45,24,16,0.15)]">
        <svg className="w-3.5 h-3.5 text-[#2D1810] mb-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
        </svg>
        <p className="text-[8px] font-bold text-[#2D1810] tracking-widest" style={{ fontFamily: "'Fredoka', sans-serif" }}>SINCE</p>
        <p className="text-[11px] font-black text-[#2D1810]" style={{ fontFamily: "'Fredoka', sans-serif" }}>2019</p>
      </div>

      {/* Torn paper corner - bottom left, notebook grid peeking through */}
      <div className="absolute bottom-0 left-0 w-64 h-24 notebook-grid torn-corner-cream opacity-90" />

      {/* Torn paper corner - bottom right, kraft paper with handwritten tagline */}
      <div className="absolute bottom-0 right-0 w-72 h-40 bg-[#C8A877] torn-corner-kraft flex items-end justify-end p-6">
        <p className="font-cursive-note text-lg text-[#2D1810] text-right leading-tight rotate-[-2deg]">
          be kind<br />to your body ♡
        </p>
      </div>
    </div>
  )
}
