import React from 'react';

export const ReviewHeader: React.FC = React.memo(() => {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-8 pb-4 relative z-10 select-none">
      {/* ★★★★★ Golden Yellow Rating Stars */}
      <div className="flex items-center gap-1.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFE066] fill-current filter drop-shadow-[1px_1px_0_#3B2A22]" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>

      {/* Main Heading: WHAT OUR CUSTOMERS SAY (Shrikhand Ultra-Aesthetic Retro-Artisan Bakery Display) */}
      <h2 
        id="reviews-heading" 
        className="font-shrikhand text-4xl sm:text-6xl md:text-7xl text-[#3B2A22] tracking-wide font-normal uppercase leading-[1.1] filter drop-shadow-[2px_2px_0_rgba(255,224,102,0.6)]"
      >
        What Our Customers Say
      </h2>

      {/* Handwritten Subtitle (Mali Marker Handwriting) */}
      <p className="font-mali text-2xl sm:text-3xl font-bold text-[#EF5B5B] mt-2 rotate-[-1.5deg]">
        sweet memories & happy tummies ♡
      </p>
    </div>
  );
});

ReviewHeader.displayName = 'ReviewHeader';

