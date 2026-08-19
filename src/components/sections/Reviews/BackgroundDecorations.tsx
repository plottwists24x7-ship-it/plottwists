import React from 'react';

export const BackgroundDecorations: React.FC = React.memo(() => {
  return (
    <>
      {/* Gigantic Background Brushes */}
      <svg className="absolute top-[-250px] left-[8%] w-[420px] h-[1700px] pointer-events-none opacity-[0.22] text-[#F8C8DC] z-0" viewBox="0 0 420 1700" fill="none" aria-hidden="true">
        <path d="M 210 -100 C 110 300 310 750 160 1200 C 110 1350 240 1550 210 1750" stroke="currentColor" strokeWidth="240" strokeLinecap="round" />
      </svg>
      
      <svg className="absolute top-[-150px] left-[45%] w-[450px] h-[1700px] pointer-events-none opacity-[0.22] text-[#F4BBD3] z-0" viewBox="0 0 450 1700" fill="none" aria-hidden="true">
        <path d="M 225 -80 C 325 450 125 900 275 1350 C 325 1500 175 1600 225 1750" stroke="currentColor" strokeWidth="280" strokeLinecap="round" />
      </svg>

      {/* Hand-Drawn Baby-Pink Scrapbook Doodles (#E685B5, 35% Opacity, 1.8px Stroke) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden text-[#E685B5] opacity-[0.35]" aria-hidden="true">
        {/* Top-Left Corner Doodles */}
        <svg className="absolute top-[2%] left-[2%] w-[48px] h-[48px] -rotate-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4 Q25 18 38 24 Q25 30 24 44 Q23 30 10 24 Q23 18 24 4 Z" />
        </svg>
        <svg className="absolute top-[5%] left-[8%] w-[55px] h-[55px] rotate-15" viewBox="0 0 55 55" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="10" y1="18" x2="45" y2="18" /><line x1="10" y1="28" x2="45" y2="28" /><line x1="10" y1="38" x2="45" y2="38" />
          <line x1="18" y1="10" x2="18" y2="45" /><line x1="28" y1="10" x2="28" y2="45" /><line x1="38" y1="10" x2="38" y2="45" />
        </svg>
        <svg className="absolute top-[12%] left-[3%] w-[38px] h-[38px] -rotate-25" viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M19 19 C12 12, 6 22, 16 30 C26 36, 34 22, 22 10 C14 2, 2 14, 10 26" />
        </svg>
        <svg className="absolute top-[18%] left-[1%] w-[26px] h-[26px] rotate-10" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M13 22 C6 16, 2 10, 6 5 C10 0, 13 8, 13 8 C13 8, 16 0, 20 5 C24 10, 20 16, 13 22 Z" />
        </svg>
        <svg className="absolute top-[22%] left-[6%] w-[65px] h-[35px] -rotate-6" viewBox="0 0 65 35" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 25 Q 32 8, 60 22 Q 35 32, 10 15" />
        </svg>

        {/* Top-Right Corner Doodles */}
        <svg className="absolute top-[3%] right-[2%] w-[52px] h-[52px] rotate-20" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M26 4 L26 48 M4 26 L48 26 M11 11 L41 41 M41 11 L11 41" />
        </svg>
        <svg className="absolute top-[8%] right-[7%] w-[40px] h-[40px] -rotate-15" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 32 Q20 12, 32 8 M32 8 L22 10 M32 8 L30 18" />
        </svg>
        <svg className="absolute top-[14%] right-[3%] w-[32px] h-[32px] rotate-30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="16" cy="16" r="12" strokeDasharray="3 3" />
        </svg>
        <svg className="absolute top-[20%] right-[8%] w-[60px] h-[60px] -rotate-10" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 15 L18 40 L31 15 L44 40 L57 15" />
        </svg>
        <svg className="absolute top-[26%] right-[2%] w-[24px] h-[24px] rotate-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 2 L12 22 M2 12 L22 12" />
        </svg>

        {/* Bottom-Left Corner Doodles */}
        <svg className="absolute bottom-[3%] left-[2%] w-[68px] h-[68px] rotate-15" viewBox="0 0 68 68" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="10" y="10" width="48" height="48" rx="4" />
          <line x1="10" y1="26" x2="58" y2="26" /><line x1="10" y1="42" x2="58" y2="42" />
          <line x1="26" y1="10" x2="26" y2="58" /><line x1="42" y1="10" x2="42" y2="58" />
        </svg>
        <svg className="absolute bottom-[8%] left-[7%] w-[44px] h-[44px] -rotate-20" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 8 Q36 12, 28 36 M28 36 L20 30 M28 36 L34 28" />
        </svg>
        <svg className="absolute bottom-[14%] left-[3%] w-[36px] h-[36px] rotate-25" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 18 A12 12 0 0 1 30 18 A12 12 0 0 1 6 18" />
        </svg>
        <svg className="absolute bottom-[18%] left-[8%] w-[28px] h-[28px] -rotate-10" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 24 C7 18, 3 11, 7 6 C11 1, 14 9, 14 9 C14 9, 17 1, 21 6 C25 11, 21 18, 14 24 Z" />
        </svg>
        <svg className="absolute bottom-[24%] left-[2%] w-[58px] h-[30px] rotate-12" viewBox="0 0 58 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 12 Q30 4, 54 12 M8 20 Q32 12, 50 20" />
        </svg>

        {/* Bottom-Right Corner Doodles */}
        <svg className="absolute bottom-[2%] right-[3%] w-[56px] h-[56px] -rotate-18" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M28 6 Q29 22 44 28 Q29 34 28 50 Q27 34 12 28 Q27 22 28 6 Z" />
        </svg>
        <svg className="absolute bottom-[7%] right-[8%] w-[48px] h-[48px] rotate-22" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M24 24 C14 14, 8 28, 20 38 C32 46, 42 28, 28 12 C18 2, 4 18, 16 32" />
        </svg>
        <svg className="absolute bottom-[13%] right-[2%] w-[34px] h-[34px] -rotate-15" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="17" cy="17" r="12" />
          <line x1="17" y1="5" x2="17" y2="29" /><line x1="5" y1="17" x2="29" y2="17" />
        </svg>
        <svg className="absolute bottom-[19%] right-[7%] w-[70px] h-[40px] rotate-8" viewBox="0 0 70 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 20 Q 20 5, 35 20 T 65 20" />
        </svg>
        <svg className="absolute bottom-[25%] right-[3%] w-[26px] h-[26px] -rotate-30" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M13 2 L13 24 M2 13 L24 13" />
        </svg>

        {/* Edge-Cropped Perimeter Doodles */}
        <svg className="absolute top-[48%] left-[-12px] w-[42px] h-[60px] rotate-15" viewBox="0 0 42 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10 5 C30 15, 5 30, 25 45 T 35 55" />
        </svg>
        <svg className="absolute top-[52%] right-[-14px] w-[50px] h-[45px] -rotate-20" viewBox="0 0 50 45" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 10 L20 35 L35 10 L45 35" />
        </svg>

        {/* Middle Gap Minimal Doodles (Between Heading & Cards: left 30% - 38%) */}
        <svg className="absolute top-[15%] left-[32%] w-[42px] h-[42px] rotate-12" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10 20 C5 10, 20 5, 25 18 C30 30, 15 35, 22 22" />
        </svg>
        <svg className="absolute top-[28%] left-[35%] w-[36px] h-[36px] -rotate-15" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 4 Q19 14 30 18 Q19 22 18 32 Q17 22 6 18 Q17 14 18 4 Z" />
        </svg>
        <svg className="absolute top-[42%] left-[31%] w-[48px] h-[28px] rotate-8" viewBox="0 0 48 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 14 Q 24 2, 44 14 M8 22 Q 24 10, 40 22" />
        </svg>
        <svg className="absolute top-[56%] left-[34%] w-[32px] h-[32px] rotate-25" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M16 26 C9 20, 4 13, 8 7 C12 1, 16 10, 16 10 C16 10, 20 1, 24 7 C28 13, 23 20, 16 26 Z" />
        </svg>
        <svg className="absolute top-[70%] left-[32%] w-[40px] h-[40px] -rotate-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M20 20 C14 14, 8 22, 18 30 C28 36, 36 22, 24 10" />
        </svg>
        <svg className="absolute top-[82%] left-[36%] w-[35px] h-[25px] rotate-18" viewBox="0 0 35 25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 18 Q 17 8, 31 18" />
        </svg>
      </div>
    </>
  );
});

BackgroundDecorations.displayName = 'BackgroundDecorations';
