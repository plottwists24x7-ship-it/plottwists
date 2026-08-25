"use client";

import React, { useState } from "react";

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" x2="19" y1="12" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#22D3EE"
    stroke="#3D2E25"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M4 11h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a1 1 0 0 1 1-1Z" />
    <path d="M12 2C9.5 2 7.5 5 7.5 8h9C16.5 5 14.5 2 12 2Z" fill="#F43F5E" />
    <circle cx="12" cy="2" r="1.5" fill="#DDF51A" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="19" y1="6" y2="18" />
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <nav
        aria-label="Primary Navigation"
        className="fixed top-4 md:top-10 left-1/2 transform -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-7xl z-50 px-4 md:px-6 py-2.5 md:py-3.5 bg-[#FAF9F6] border-4 border-[#3D2E25] rounded-2xl shadow-[5px_5px_0px_0px_#3D2E25,0_8px_28px_rgba(0,0,0,0.06)] flex items-center justify-between transition-all"
      >
        {/* Scrapbook Tucked Layering behind Navbar (System 2) */}
        <div className="hidden lg:block absolute -top-4 -right-6 bg-[#22D3EE] text-[#3D2E25] font-bubble text-[9px] uppercase tracking-widest px-3 py-1 border-2 border-[#3D2E25] rounded-lg shadow-xs rotate-6 opacity-35 -z-10 pointer-events-none select-none">
          sugar-free
        </div>
        <div 
          className="hidden lg:block absolute -top-5 -left-6 w-16 h-8 bg-[#FAF9F6] border border-[#3D2E25]/20 shadow-xs -rotate-8 opacity-15 -z-10 pointer-events-none select-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px)" }}
        />

        {/* Logo brand */}
        <button
          onClick={() => handleScrollTo("hero")}
          className="flex items-center gap-2.5 font-bubble text-xl md:text-2xl text-[#3D2E25] cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none min-h-[44px]"
        >
          <LogoIcon />
          <span>plotwist</span>
        </button>

        {/* Desktop Navigation Link Pills */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleScrollTo("story")}
            className="group bg-white text-[#3D2E25] border-3 border-[#3D2E25] shadow-[3px_3px_0px_0px_#3D2E25] hover:bg-[#DDF51A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#3D2E25] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[3px_3px_0px_0px_#3D2E25] px-5 py-2 rounded-full font-bubble text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">★</span>
            <span>Story</span>
          </button>
          <button
            onClick={() => handleScrollTo("bakes")}
            className="group bg-white text-[#3D2E25] border-3 border-[#3D2E25] shadow-[3px_3px_0px_0px_#3D2E25] hover:bg-[#DDF51A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#3D2E25] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[3px_3px_0px_0px_#3D2E25] px-5 py-2 rounded-full font-bubble text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">★</span>
            <span>Bakes</span>
          </button>
          <button
            onClick={() => handleScrollTo("gallery")}
            className="group bg-white text-[#3D2E25] border-3 border-[#3D2E25] shadow-[3px_3px_0px_0px_#3D2E25] hover:bg-[#DDF51A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#3D2E25] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[3px_3px_0px_0px_#3D2E25] px-5 py-2 rounded-full font-bubble text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">★</span>
            <span>Gallery</span>
          </button>
        </div>

        {/* Right CTA arrow button & mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={preventDefault}
            className="hidden sm:flex bg-[#F43F5E] text-[#FAF9F6] border-3 border-[#3D2E25] shadow-[3px_3px_0px_0px_#3D2E25] hover:bg-[#DDF51A] hover:text-[#3D2E25] hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] hover:shadow-[4px_4px_0px_0px_#3D2E25] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[3px_3px_0px_0px_#3D2E25] w-10 h-10 rounded-full items-center justify-center transition-all cursor-pointer focus-visible:outline-none"
            aria-label="Open contact page placeholder"
          >
            <ArrowRightIcon />
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#3D2E25] hover:opacity-80 transition-opacity p-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer bg-transparent border-none focus-visible:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 bg-[#FDFBF7] border-[12px] border-[#3D2E25] z-40 flex flex-col justify-center items-center gap-8 font-bubble text-3xl transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <button
          onClick={() => handleScrollTo("story")}
          className="text-[#3D2E25] hover:text-[#F43F5E] uppercase tracking-wider cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none"
        >
          Story
        </button>
        <button
          onClick={() => handleScrollTo("bakes")}
          className="text-[#3D2E25] hover:text-[#F43F5E] uppercase tracking-wider cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none"
        >
          Bakes
        </button>
        <button
          onClick={() => handleScrollTo("gallery")}
          className="text-[#3D2E25] hover:text-[#F43F5E] uppercase tracking-wider cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none"
        >
          Gallery
        </button>
      </div>
    </>
  );
}
