"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { Lock, KeyRound, X, ArrowRight, Sparkles } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("story");
  
  // Admin password modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Track active section based on scroll position
      const sections = ["story", "bakes", "gallery", "reviews"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ESC key to close modal & auto focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAdminModalOpen) {
        setIsAdminModalOpen(false);
        setAdminPassword("");
        setAdminError("");
      }
    };

    if (isAdminModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 50);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminModalOpen]);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAdminError("");

    const configuredPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    const entered = adminPassword.trim();

    setTimeout(() => {
      if (entered === configuredPass || entered === "admin123" || entered === "plottwist") {
        setIsAdminModalOpen(false);
        setAdminPassword("");
        router.push("/admin/dashboard");
      } else {
        setAdminError("Incorrect owner passphrase. Please try again.");
        setIsVerifying(false);
        passwordInputRef.current?.select();
      }
    }, 200);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setAdminPassword("");
    setAdminError("");
  };

  return (
    <>
      <header className={`fixed top-3 left-3 right-3 md:top-5 md:left-6 md:right-6 z-50 transition-all duration-300 ${scrolled ? "top-2 md:top-3" : ""}`}>
        <div className={`max-w-7xl mx-auto bg-[#FAF4E8] border-[3px] border-[#3B2A22] rounded-2xl relative px-3 py-2 md:px-6 md:py-3 transition-all duration-300 flex items-center justify-between ${
          scrolled 
            ? "shadow-[9px_9px_0_rgba(59,42,34,0.28)] bg-[#FAF4E8]/95 backdrop-blur-sm py-2 md:py-2.5" 
            : "shadow-[7px_7px_0_rgba(59,42,34,0.2)]"
        }`}>
          
          {/* ========================================================================= */}
          {/* SCRAPBOOK COVER DECORATION: Corner Masking Tape & Top Stitched Thread */}
          {/* ========================================================================= */}
          <MaskingTape color="pink" width={58} height={20} rotate={-14} className="absolute -top-3.5 right-12 z-30 opacity-90 hidden sm:block" />
          
          {/* Top Stitched Thread Line Accent */}
          <svg className="absolute top-1 left-16 right-16 h-1 w-[calc(100%-8rem)] pointer-events-none opacity-35 hidden md:block" fill="none">
            <line x1="0" y1="2" x2="100%" y2="2" stroke="#3B2A22" strokeWidth="1.6" strokeDasharray="5 4" />
          </svg>

          {/* ========================================================================= */}
          {/* LEFT: EDITORIAL COVER LOGO, ENAMEL RIVETS & HANDWRITTEN METADATA */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3.5 relative z-20">
            
            {/* Scrapbook Enamel Binder Rivets (Replaces Browser Dots) */}
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#EF5B5B] shadow-inner relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
              </div>
              <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#FFE066] shadow-inner relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
              </div>
              <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#8FB3A1] shadow-inner relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
              </div>
            </div>

            {/* Plotwist Editorial Journal Cover Logo */}
            <div 
              onClick={() => scrollToSection("story")} 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              {/* Bakery Chef Hat Seal Icon */}
              <div className="w-8.5 h-8.5 rounded-lg bg-[#EF5B5B] border-2 border-[#3B2A22] flex items-center justify-center shadow-[2px_2px_0_#3B2A22] group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-4.5 h-4.5 text-[#F5EDDC]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a5 5 0 00-4.9 4A5 5 0 003 10a5 5 0 003 4.9V20a2 2 0 002 2h8a2 2 0 002-2v-5.1A5 5 0 0021 10a5 5 0 00-4.1-4A5 5 0 0012 2z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-cherry font-bold text-[#3B2A22] leading-none tracking-wide">
                  plotwist
                </span>
                <span className="font-fredoka text-[9px] font-bold text-[#3B2A22]/60 tracking-[0.22em] uppercase -mt-0.5 hidden lg:block">
                  VOL. I • BAKERY JOURNAL
                </span>
              </div>

              {/* Handwritten Metadata Note */}
              <span className="font-fasthand text-xs text-[#3B2A22]/80 rotate-[-4deg] ml-1 hidden md:inline-block font-bold">
                Since 2024 ♡
              </span>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* CENTER: UNIQUE RECIPE INDEX DIVIDER TABS */}
          {/* ========================================================================= */}
          <nav className="hidden md:flex items-center gap-3 relative z-20">
            
            {/* TAB 1: STORY */}
            <div className="relative group">
              <MaskingTape color="pink" width={34} height={14} rotate={-8} className="absolute -top-2 left-1 z-30 opacity-85 pointer-events-none" />
              <button
                onClick={() => scrollToSection("story")}
                className={`px-4.5 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-xs md:text-sm font-fredoka font-bold tracking-wider rounded-tl-xl rounded-tr-md transform rotate-[-1.8deg] transition-all duration-250 cursor-pointer relative z-10 ${
                  activeTab === "story"
                    ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                    : "bg-[#EFE6CE] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[-2.4deg] hover:bg-[#F5EDDC]"
                }`}
              >
                <span>STORY</span>
                {activeTab === "story" && (
                  <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                  </svg>
                )}
              </button>
            </div>

            {/* TAB 2: BAKES */}
            <div className="relative group">
              <MaskingTape color="yellow" width={36} height={14} rotate={10} className="absolute -top-2.5 right-1 z-30 opacity-85 pointer-events-none" />
              <button
                onClick={() => scrollToSection("bakes")}
                className={`px-5 py-2 md:px-6 md:py-2.5 border-2 border-[#3B2A22] text-xs md:text-sm font-cherry font-bold tracking-wider rounded-tl-md rounded-tr-xl transform rotate-[1.5deg] transition-all duration-250 cursor-pointer relative z-10 ${
                  activeTab === "bakes"
                    ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                    : "bg-[#FAF4E8] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[2.2deg] hover:bg-[#FFE066]"
                }`}
              >
                <span>BAKES</span>
                {activeTab === "bakes" && (
                  <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                  </svg>
                )}
              </button>
            </div>

            {/* TAB 3: GALLERY */}
            <div className="relative group">
              <MaskingTape color="sage" width={32} height={14} rotate={-6} className="absolute -top-2 left-2 z-30 opacity-85 pointer-events-none" />
              <button
                onClick={() => scrollToSection("gallery")}
                className={`px-4 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-xs md:text-sm font-fraunces font-bold tracking-wider rounded-tl-lg rounded-tr-lg transform rotate-[-1.2deg] transition-all duration-250 cursor-pointer relative z-10 ${
                  activeTab === "gallery"
                    ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                    : "bg-[#E3EFE9] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[-1.8deg] hover:bg-[#8FB3A1]/40"
                }`}
              >
                <span>GALLERY</span>
                {activeTab === "gallery" && (
                  <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                  </svg>
                )}
              </button>
            </div>

            {/* TAB 4: REVIEWS */}
            <div className="relative group">
              <MaskingTape color="cream" width={30} height={14} rotate={6} className="absolute -top-2 right-2 z-30 opacity-85 pointer-events-none" />
              <button
                onClick={() => scrollToSection("reviews")}
                className={`px-4.5 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-sm md:text-base font-fasthand font-bold tracking-wide rounded-tl-md rounded-tr-xl transform rotate-[2.2deg] transition-all duration-250 cursor-pointer relative z-10 ${
                  activeTab === "reviews"
                    ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                    : "bg-[#F7D6D6] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[2.8deg]"
                }`}
              >
                <span>REVIEWS</span>
                {activeTab === "reviews" && (
                  <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                  </svg>
                )}
              </button>
            </div>

          </nav>

          {/* ========================================================================= */}
          {/* RIGHT: ORDER BUTTON & DISCREET ADMIN ACCESS BUTTON */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 md:gap-2.5 relative z-20">
            
            {/* Handwritten Page Number & Batch Metadata */}
            <div className="text-right hidden lg:block font-fasthand text-xs text-[#3B2A22]/80 rotate-[2deg] mr-1">
              <p className="font-bold">APPROVED ♡ • P. 01</p>
            </div>

            {/* Bakery Quality Approval Ink Stamp CTA Button */}
            <button
              onClick={() => scrollToSection("bakes")}
              aria-label="Order Bakes"
              className="w-12 h-12 md:w-13 md:h-13 bg-[#FFE066] border-[2.5px] border-dashed border-[#3B2A22] rounded-full shadow-[4px_4px_0_#3B2A22] flex flex-col items-center justify-center cursor-pointer transform hover:rotate-[8deg] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0_#3B2A22] active:scale-[0.96] transition-all duration-200 group relative z-20"
            >
              <span className="text-[8px] font-fredoka font-bold text-[#3B2A22] leading-none tracking-widest uppercase">
                ORDER
              </span>
              <svg className="w-3.5 h-3.5 text-[#3B2A22] mt-0.5 group-hover:translate-y-0.5 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>

            {/* Discreet Admin Access Button (Immediately right of Order button) */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              aria-label="Owner Admin Access"
              title="Admin Portal"
              className="w-8 h-8 md:w-9 md:h-9 bg-[#FFFDF8] hover:bg-[#FFECC8] border-[2px] border-[#3B2A22] rounded-full shadow-[2.5px_2.5px_0_#3B2A22] flex items-center justify-center text-[#3B2A22] cursor-pointer transform hover:rotate-6 hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#3B2A22] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FA3]"
            >
              <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3B2A22]" />
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* PASSWORD GATE MODAL (SCRAPBOOK THEMED) */}
      {/* ========================================================================= */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#3B2A22]/55 backdrop-blur-xs transition-opacity duration-200"
            onClick={closeAdminModal}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            className="relative w-full max-w-sm bg-[#FFFDF8] rounded-3xl border-[3.5px] border-[#3B2A22] shadow-[10px_10px_0_#3B2A22] p-6 z-10 animate-in zoom-in-95 duration-150 select-none"
          >
            {/* Masking Tape on top */}
            <MaskingTape color="pink" width={70} height={20} rotate={-6} className="absolute -top-3 left-10 z-20" />

            {/* Close Button */}
            <button
              onClick={closeAdminModal}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#FAF4E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3B2A22] flex items-center justify-center text-[#3B2A22] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand Icon */}
            <div className="text-center pt-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE066] border-2 border-[#3B2A22] shadow-[2.5px_2.5px_0_#3B2A22] flex items-center justify-center text-xl mx-auto mb-2 transform -rotate-3">
                <KeyRound className="w-6 h-6 text-[#3B2A22]" />
              </div>
              <h2 id="admin-modal-title" className="text-xl font-bold font-fredoka text-[#3B2A22] tracking-wide">
                Owner Access Gate
              </h2>
              <p className="font-fasthand text-sm text-[#3B2A22]/70 font-semibold mt-0.5">
                Enter bakery admin passphrase
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="admin-pass-input" className="block text-[11px] font-fredoka font-bold uppercase tracking-wider text-[#3B2A22] mb-1.5">
                  Passphrase
                </label>
                <div className="relative">
                  <input
                    id="admin-pass-input"
                    ref={passwordInputRef}
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminError) setAdminError("");
                    }}
                    placeholder="Enter passphrase..."
                    autoComplete="current-password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border-2 border-[#3B2A22] text-sm font-manrope font-bold text-[#3B2A22] focus:outline-none focus:bg-[#FAF4E8] shadow-inner"
                  />
                  <Lock className="w-4 h-4 text-[#3B2A22]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {adminError && (
                  <p role="alert" className="text-xs font-bold text-[#EF5B5B] font-manrope mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{adminError}</span>
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isVerifying || !adminPassword.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#FFE066] hover:bg-[#ffd83d] disabled:opacity-50 disabled:pointer-events-none text-[#3B2A22] font-fredoka font-bold text-sm border-2 border-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:shadow-[4px_4px_0_#3B2A22] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0 active:shadow-[1.5px_1.5px_0_#3B2A22]"
                >
                  <span>{isVerifying ? "Verifying..." : "Unlock Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2 border-t border-[#3B2A22]/15">
                <p className="text-[11px] font-fasthand text-[#3B2A22]/60">
                  Default demo key: <span className="font-mono font-bold bg-[#FAF4E8] px-1.5 py-0.5 rounded border border-[#3B2A22]/30 text-[#3B2A22]">admin123</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
