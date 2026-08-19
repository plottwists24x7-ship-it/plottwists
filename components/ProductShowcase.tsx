import Image from 'next/image'
import { MaskingTape } from '@/components/paper/MaskingTape'
import { PaperLabel } from '@/components/paper/PaperLabel'
import { RecipeCard } from '@/components/paper/RecipeCard'

export function ProductShowcase() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating hearts above circle */}
      <svg className="absolute top-2 left-16 w-6 h-6 text-[#2D1810] opacity-70 z-20 animate-paper-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s-6.5-4.35-9.3-8.1C1 10.5 1.6 7 4.6 5.6 6.9 4.5 9.4 5.4 12 8c2.6-2.6 5.1-3.5 7.4-2.4 3 1.4 3.6 4.9 1.9 7.3C18.5 16.65 12 21 12 21z" />
      </svg>
      <svg className="absolute top-10 left-28 w-4 h-4 text-[#2D1810] opacity-60 z-20 animate-paper-float" style={{ animationDelay: '1.5s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s-6.5-4.35-9.3-8.1C1 10.5 1.6 7 4.6 5.6 6.9 4.5 9.4 5.4 12 8c2.6-2.6 5.1-3.5 7.4-2.4 3 1.4 3.6 4.9 1.9 7.3C18.5 16.65 12 21 12 21z" />
      </svg>

      {/* Main product circle frame - the composition's focal point */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 z-10">
        {/* Ambient glow sitting behind the cheesecake, ties it into the paper world */}
        <div className="absolute inset-0 rounded-full ambient-glow" />

        {/* Tape holding the circle at the top */}
        <MaskingTape color="kraft" width={80} height={28} rotate={2} className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" />

        <div className="absolute inset-0 animate-breathe">
          {/* Layered paper-cutout shadow stack: contact + ambient + floating */}
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 2px 3px rgba(45,24,16,0.35), 0 10px 16px rgba(45,24,16,0.22), 0 24px 40px rgba(45,24,16,0.16)' }} />

          {/* Outer decorative circle */}
          <div className="absolute inset-0 rounded-full border-[6px] border-[#2D1810] rotate-1" />

          {/* Product Video Animation - circular mask, framed with paper cutout */}
          <div className="absolute inset-[6px] rounded-full overflow-hidden rotate-1 bg-[#2D1810]">
            <video
              src="/Scene.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
            />
          </div>

          {/* Inner highlight ring */}
          <div className="absolute inset-3 rounded-full border border-white/40 pointer-events-none rotate-1" />
        </div>
      </div>

      {/* Made Fresh Daily - blue circle, overlapping top-right */}
      <div className="absolute top-2 right-2 md:right-0 w-24 h-24 bg-[#7BA3C4] rounded-full border-[3px] border-[#2D1810] shadow-[3px_3px_0_rgba(45,24,16,0.2)] flex flex-col items-center justify-center z-20 rotate-3 animate-paper-wobble">
        <p className="text-[10px] font-bold text-[#2D1810] text-center leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>MADE FRESH</p>
        <p className="text-[10px] font-bold text-[#2D1810] text-center leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>DAILY</p>
      </div>

      {/* Lactose-Free tag */}
      <PaperLabel text="LACTOSE-FREE" color="yellow" rotate={3} className="absolute top-24 -right-2 md:-right-6 z-20" />

      {/* Sugar-Free tag - left of circle */}
      <PaperLabel text="SUGAR-FREE" color="coral" rotate={-6} className="absolute top-1/2 -left-4 md:-left-10 z-20" />

      {/* Made with love note - bottom left, overlapping circle, taped down */}
      <div className="absolute bottom-14 -left-6 md:-left-12 z-20">
        <MaskingTape color="pink" width={44} height={16} rotate={-16} className="absolute -top-2 left-1/2 -translate-x-1/2 z-30" />
        <RecipeCard rotate={-6} edge={1} width={128}>
          <p className="text-sm font-cursive-note text-[#2D1810] text-center leading-tight">
            Made<br />with love,<br />for you. ♥
          </p>
        </RecipeCard>
      </div>

      {/* Checklist card - bottom right */}
      <div className="absolute bottom-4 -right-2 md:-right-8 w-52 bg-[#EF9A9A] border-2 border-[#2D1810] shadow-[3px_3px_0_rgba(45,24,16,0.2)] p-4 rounded-lg transform rotate-2 z-20">
        <div className="space-y-2">
          {['No Refined Sugar', 'High Protein', 'Real Ingredients', '100% Delicious'].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-[#2D1810] rounded flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-[#2D1810]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#2D1810]" style={{ fontFamily: "'Fredoka', sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* High-Protein oval badge */}
      <PaperLabel text="HIGH-PROTEIN" color="blue" pill rotate={-2} className="absolute bottom-0 right-8 md:right-4 z-10 !px-5 !py-2.5" />

      {/* Decorative strawberry */}
      <div className="absolute bottom-24 left-1/3 w-9 h-9 z-10">
        <svg className="w-full h-full text-[#D14545]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 7h-6V6h-6v3H3l6 11h12l6-11z" />
        </svg>
      </div>

      {/* Scroll to discover - bottom center */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <p className="text-[11px] font-bold text-[#2D1810] tracking-widest" style={{ fontFamily: "'Fredoka', sans-serif" }}>SCROLL TO DISCOVER</p>
        <div className="bg-[#2D1810]/20 h-px w-16 -mt-1 mb-1" />
        <button aria-label="Scroll down" className="w-9 h-9 bg-[#8FB3A1] rounded-full flex items-center justify-center border-2 border-[#2D1810]">
          <svg className="w-4 h-4 text-[#2D1810] animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
