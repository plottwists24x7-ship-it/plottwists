"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MenuCategoryConfig } from "./menu-data";
import { MenuProductRow } from "./MenuProductRow";
import {
  sheetBoxesVariants,
  sheetJarsVariants,
  sheetWafflesVariants,
} from "./menu-animations";

interface MenuCategorySheetProps {
  category: MenuCategoryConfig;
}

export function MenuCategorySheet({ category }: MenuCategorySheetProps) {
  const shouldReduceMotion = useReducedMotion();

  // Select entrance variant per sheet
  const motionVariant =
    category.id === "boxes"
      ? sheetBoxesVariants
      : category.id === "jars"
      ? sheetJarsVariants
      : sheetWafflesVariants;

  // Desktop vs mobile rotation classes
  const rotationClass =
    category.id === "boxes"
      ? "md:-rotate-[1.2deg]"
      : category.id === "jars"
      ? "md:rotate-[1.2deg]"
      : "md:-rotate-[0.8deg]";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : motionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`relative w-full rounded-2xl md:rounded-3xl border-[3px] border-[#3B2922] shadow-[5px_6px_0px_#3B2922] md:shadow-[6px_7px_0px_#3B2922] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_9px_0px_#3B2922] ${rotationClass}`}
      style={{ backgroundColor: category.bgColor }}
      id={`menu-sheet-${category.id}`}
    >
      {/* ── TOP WASHI TAPE (Overhanging physical tape) ── */}
      <div
        className={`absolute -top-3.5 sm:-top-4 ${
          category.id === "boxes" ? "left-[26%] sm:left-[28%]" : "left-1/2"
        } -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs select-none`}
        style={{ transform: `translateX(-50%) rotate(${category.tapeRotate}deg)` }}
      >
        <Image
          src={category.tapeAsset}
          alt={category.tapeAlt}
          width={108}
          height={32}
          className="w-18 sm:w-22 md:w-24 h-auto"
          priority
        />
      </div>

      {/* ── 01 / BOXES SPECIFIC: Notebook Spiral Punch Holes & Paperclip ── */}
      {category.id === "boxes" && (
        <>
          <div
            className="absolute left-2 sm:left-2.5 top-10 bottom-8 flex flex-col justify-between items-center pointer-events-none z-10"
            aria-hidden="true"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={`punch-hole-${i}`}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#3B2922] shadow-[inset_1px_1px_1.5px_rgba(0,0,0,0.55)]"
              />
            ))}
          </div>
          {/* Brown Paperclip at Top Left Edge */}
          <div
            className="absolute -top-3.5 left-5 z-20 pointer-events-none select-none drop-shadow-xs"
            aria-hidden="true"
          >
            <Image
              src="/images/menu-decor/paperclip-brown.svg"
              alt=""
              width={22}
              height={44}
              className="w-4 sm:w-5 h-auto rotate-12"
            />
          </div>
        </>
      )}

      {/* ── SHEET INNER CONTENT ── */}
      <div
        className={`p-3 sm:p-4 md:p-4.5 pb-5 sm:pb-6 relative ${
          category.id === "boxes" ? "pl-6 sm:pl-7.5 md:pl-8" : ""
        }`}
      >
        {/* ── 01 / BOXES SPECIFIC: Ruled Notebook Inner Border ── */}
        {category.id === "boxes" && (
          <div
            className="absolute inset-2 sm:inset-2.5 rounded-xl border border-[#3B2922]/15 pointer-events-none z-0"
            aria-hidden="true"
          />
        )}

        {/* ── 02 / JARS SPECIFIC: Dashed Stitched Inner Border & Stamp Mark ── */}
        {category.id === "jars" && (
          <>
            <div
              className="absolute inset-2 sm:inset-2.5 rounded-xl border-1.5 border-dashed border-[#3B2922]/30 pointer-events-none z-0"
              aria-hidden="true"
            />
            {/* Tiny Risograph Stamp Mark at Top-Right of Jars */}
            <div
              className="hidden sm:block absolute top-2 right-2 opacity-25 pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <span className="font-mono text-[8px] uppercase tracking-wider text-[#3B2922]">
                ✦ CRAFTED DAILY
              </span>
            </div>
          </>
        )}

        {/* ── 03 / WAFFLES SPECIFIC: Ruled Framing Inner Border ── */}
        {category.id === "waffles" && (
          <div
            className="absolute inset-2 sm:inset-2.5 rounded-xl border border-dashed border-[#3B2922]/20 pointer-events-none z-0"
            aria-hidden="true"
          />
        )}

        {/* ── HEADER BADGE / PILL ── */}
        <div className="relative z-10 flex items-center justify-center mb-2.5 sm:mb-3 pt-0.5">
          {/* Left comic tick marks for Jars & Waffles */}
          {category.id !== "boxes" && (
            <div className="flex gap-1 mr-1.5 opacity-75" aria-hidden="true">
              <span className="w-1 h-2.5 border-r-2 border-[#3B2922] -rotate-12 inline-block" />
              <span className="w-1 h-2.5 border-r-2 border-[#3B2922] -rotate-6 inline-block" />
            </div>
          )}

          {/* Badge Pill */}
          <div
            className={`px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-full border-2 border-[#3B2922] shadow-[2.5px_2.5px_0px_#3B2922] flex items-center justify-center`}
            style={{
              backgroundColor: category.pillColor,
              color: category.pillTextColor,
            }}
          >
            <h3
              className={`${category.titleFontClass} font-bold text-xs sm:text-sm md:text-[15px] tracking-wider uppercase select-none`}
            >
              {category.badgeLabel}
            </h3>
          </div>

          {/* Right comic tick marks / burst */}
          <div className="flex gap-1 ml-1.5 opacity-75" aria-hidden="true">
            <span className="w-1 h-2.5 border-l-2 border-[#3B2922] rotate-6 inline-block" />
            <span className="w-1 h-2.5 border-l-2 border-[#3B2922] rotate-12 inline-block" />
          </div>
        </div>

        {/* ── PRODUCT ITEMS LIST ── */}
        <div className="relative z-10 space-y-0.5" role="list">
          {category.products.map((product, idx) => (
            <MenuProductRow
              key={product.id}
              product={product}
              isLast={idx === category.products.length - 1}
              category={category.id}
              nameFontClass={category.productNameFontClass}
            />
          ))}
        </div>
      </div>

      {/* ── BESPOKE CORNER STICKERS ── */}
      {category.id === "boxes" && (
        /* Pink Heart Sticker at Bottom-Right */
        <div
          className="absolute -bottom-2.5 -right-2 z-20 pointer-events-none drop-shadow select-none"
          aria-hidden="true"
        >
          <Image
            src="/images/menu-decor/heart-pink.svg"
            alt=""
            width={28}
            height={26}
            className="w-6 sm:w-7 h-auto rotate-12"
          />
        </div>
      )}

      {category.id === "waffles" && (
        /* Pink Heart Sticker at Bottom-Right */
        <div
          className="absolute -bottom-2.5 -right-2 z-20 pointer-events-none drop-shadow select-none"
          aria-hidden="true"
        >
          <Image
            src="/images/menu-decor/heart-pink.svg"
            alt=""
            width={28}
            height={26}
            className="w-6 sm:w-7 h-auto rotate-12"
          />
        </div>
      )}
    </motion.div>
  );
}
