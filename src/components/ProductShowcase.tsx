import Image from 'next/image'
import { MaskingTape } from '@/components/paper/MaskingTape'
import { PaperLabel } from '@/components/paper/PaperLabel'
import { RecipeCard } from '@/components/paper/RecipeCard'

export function ProductShowcase() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      
      {/* Hand-drawn pencil arrow pointing from headline area toward cheesecake anchor */}
      <svg className="absolute -top-6 -left-12 w-28 h-20 text-[#3B2A22] opacity-75 pointer-events-none hidden lg:block z-30" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 20 C 40 10, 80 15, 100 45" strokeDasharray="5 5" />
        <path d="M90 48 L102 47 L98 35" />
        <text x="15" y="16" fill="#3B2A22" className="font-fasthand text-xs font-bold rotate-[-6deg]">baked fresh!</text>
      </svg>

      {/* Floating hearts above circle */}
      <svg className="absolute top-0 left-20 w-6 h-6 text-[#EF5B5B] filter drop-shadow-[2px_2px_0_#3B2A22] opacity-85 z-20 animate-paper-float pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg className="absolute top-8 left-36 w-4 h-4 text-[#EF5B5B] opacity-75 z-20 animate-paper-float pointer-events-none" style={{ animationDelay: '1.5s' }} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* ========================================================================= */}
      {/* CLUSTER 1: CHEESECAKE MAIN ANCHOR CLUSTER (Enlarged by 15-20%) */}
      {/* ========================================================================= */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[450px] lg:h-[450px] z-10">
        {/* Ambient glow sitting behind the cheesecake */}
        <div className="absolute inset-0 rounded-full ambient-glow opacity-80" />

        {/* Masking tape holding the circle at top */}
        <MaskingTape color="kraft" width={90} height={30} rotate={2} className="absolute -top-4 left-1/2 -translate-x-1/2 z-30" />

        <div className="absolute inset-0 animate-breathe">
          {/* Layered paper-cutout shadow stack */}
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 4px 8px rgba(45,24,16,0.35), 0 16px 28px rgba(45,24,16,0.22), 0 32px 50px rgba(45,24,16,0.18)' }} />

          {/* Outer dark chocolate border */}
          <div className="absolute inset-0 rounded-full border-[7px] border-[#3B2A22] rotate-1" />

          {/* Product image - circular mask with smooth cutout feel */}
          <div className="absolute inset-[7px] rounded-full overflow-hidden rotate-1 bg-[#F5EDDC]">
            <Image
              src="/cheesecake.png"
              alt="Delicious homemade cheesecake"
              fill
              className="object-cover scale-[1.03] transition-transform duration-500 hover:scale-[1.07]"
              priority
            />
          </div>

          {/* Inner highlight ring */}
          <div className="absolute inset-3 rounded-full border border-white/50 pointer-events-none rotate-1" />
        </div>
      </div>

      {/* Made Fresh Daily - Blue Badge (Overlapping top-right of cheesecake) */}
      <div className="absolute top-0 right-0 md:-right-4 w-26 h-26 md:w-30 md:h-30 bg-[#7BA3C4] rounded-full border-[3px] border-[#3B2A22] shadow-[4px_4px_0_#3B2A22] flex flex-col items-center justify-center z-20 transform rotate-3 animate-paper-wobble">
        <p className="text-[11px] md:text-xs font-cherry font-bold text-[#3B2A22] text-center leading-tight uppercase tracking-wider">MADE FRESH</p>
        <p className="text-[11px] md:text-xs font-cherry font-bold text-[#3B2A22] text-center leading-tight uppercase tracking-wider">DAILY</p>
      </div>

      {/* Lactose-Free Tag */}
      <PaperLabel text="LACTOSE-FREE" color="yellow" rotate={4} className="absolute top-28 -right-4 md:-right-10 z-20" />

      {/* Sugar-Free Tag - Left of Cheesecake */}
      <PaperLabel text="SUGAR-FREE" color="coral" rotate={-6} className="absolute top-1/2 -left-6 md:-left-12 z-20" />

      {/* ========================================================================= */}
      {/* CLUSTER 2: MADE WITH LOVE NOTE & RECIPE CARD CLUSTER (Bottom Left) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-10 -left-8 md:-left-16 z-20">
        <MaskingTape color="pink" width={50} height={18} rotate={-16} className="absolute -top-3 left-1/2 -translate-x-1/2 z-30" />
        <RecipeCard rotate={-6} edge={1} width={138}>
          <div className="text-center py-1">
            <p className="text-base font-fasthand text-[#3B2A22] leading-tight">
              Made with love,
            </p>
            <p className="text-sm font-fasthand text-[#EF5B5B] leading-tight font-bold">
              for you ♡
            </p>
          </div>
        </RecipeCard>
      </div>

      {/* ========================================================================= */}
      {/* CLUSTER 3: CHECKLIST CARD & TORN PAPER CLUSTER (Bottom Right) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-2 -right-4 md:-right-10 w-56 bg-[#EF9A9A] border-[3px] border-[#3B2A22] shadow-[4px_4px_0_#3B2A22] p-4 rounded-xl transform rotate-2 z-20 animate-swing">
        <div className="space-y-2.5">
          {['No Refined Sugar', 'High Protein', 'Real Ingredients', '100% Delicious'].map((label) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-4.5 h-4.5 bg-white border-2 border-[#3B2A22] rounded flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-[#3B2A22]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-manrope font-bold text-[#3B2A22] tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* High-Protein Pill Badge with hand-drawn circle around it */}
      <div className="absolute bottom-[-18px] right-12 md:right-8 z-10">
        <PaperLabel text="HIGH-PROTEIN" color="blue" pill rotate={-2} className="!px-6 !py-3 font-manrope font-bold text-xs" />
      </div>

      {/* Decorative Hand-Drawn Strawberry Accent */}
      <div className="absolute bottom-20 left-1/3 w-9 h-9 z-10 opacity-90 animate-paper-float pointer-events-none">
        <svg className="w-full h-full text-[#D14545] filter drop-shadow-[2px_2px_0_#3B2A22]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 7h-6V6h-6v3H3l6 11h12l6-11z" />
        </svg>
      </div>

      {/* Hand-Drawn Bounce Scroll Indicator (Bottom Center) */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 cursor-pointer group" onClick={() => {
        const target = document.getElementById('story');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }}>
        <p className="text-[11px] font-manrope font-bold text-[#3B2A22] tracking-[0.2em] group-hover:text-[#EF5B5B] transition-colors duration-200 uppercase">SCROLL TO DISCOVER</p>
        <div className="bg-[#3B2A22]/30 h-px w-14" />
        <div className="w-9 h-9 bg-[#8FB3A1] rounded-full flex items-center justify-center border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] group-hover:translate-y-1 transition-transform duration-200">
          <svg className="w-4 h-4 text-[#3B2A22] animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
