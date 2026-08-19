export function Header() {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 md:top-6 md:left-8 md:right-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#F5EDDC] border-[3px] border-[#2D1810] rounded-full shadow-[4px_4px_0_rgba(45,24,16,0.15)] px-4 py-2 md:px-6 md:py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <svg className="w-6 h-6 text-[#2D1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12l1 13H5L6 7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7V5a3 3 0 016 0v2" />
          </svg>
          <span className="text-lg md:text-xl font-bold text-[#2D1810] lowercase" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            plotwist
          </span>
        </div>

        {/* Navigation Pills */}
        <nav className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2 bg-white border-2 border-[#2D1810] rounded-full text-[#2D1810] text-sm font-semibold hover:bg-[#2D1810] hover:text-white transition-all" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            STORY
          </button>
          <button className="px-5 py-2 bg-white border-2 border-[#2D1810] rounded-full text-[#2D1810] text-sm font-semibold hover:bg-[#2D1810] hover:text-white transition-all" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            BAKES
          </button>
          <button className="px-5 py-2 bg-white border-2 border-[#2D1810] rounded-full text-[#2D1810] text-sm font-semibold hover:bg-[#2D1810] hover:text-white transition-all" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            GALLERY
          </button>
        </nav>

        {/* CTA Button */}
        <button aria-label="Get started" className="w-9 h-9 md:w-10 md:h-10 bg-[#EF5B5B] rounded-full flex items-center justify-center border-2 border-[#2D1810] hover:bg-[#E54545] transition-all">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </header>
  )
}
