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
      ? "md:-rotate-[1.8deg]"
      : category.id === "jars"
      ? "md:rotate-[1.4deg]"
      : "md:-rotate-[0.8deg]";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : motionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`relative w-full rounded-3xl border-[3.5px] border-[#3B2922] shadow-[7px_8px_0px_#3B2922] md:shadow-[8px_9px_0px_#3B2922] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_11px_0px_#3B2922] ${rotationClass}`}
      style={{ backgroundColor: category.bgColor }}
      id={`menu-sheet-${category.id}`}
    >
      {/* ── TOP WASHI TAPE (Overhanging physical tape) ── */}
      <div
        className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-sm select-none"
        style={{ transform: `translateX(-50%) rotate(${category.tapeRotate}deg)` }}
      >
        <Image
          src={category.tapeAsset}
          alt={category.tapeAlt}
          width={124}
          height={36}
          className="w-24 sm:w-28 md:w-32 h-auto"
          priority
        />
      </div>

      {/* ── 01 / BOXES SPECIFIC: Notebook Spiral Punch Holes ── */}
      {category.id === "boxes" && (
        <div
          className="absolute left-2.5 sm:left-3.5 top-12 bottom-10 flex flex-col justify-between items-center pointer-events-none z-10"
          aria-hidden="true"
        >
          {[...Array(7)].map((_, i) => (
            <div
              key={`punch-hole-${i}`}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#3B2922] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]"
            />
          ))}
        </div>
      )}

      {/* ── SHEET INNER CONTENT ── */}
      <div
        className={`p-4 sm:p-6 md:p-7 relative ${
          category.id === "boxes" ? "pl-8 sm:pl-10 md:pl-12" : ""
        }`}
      >
        {/* ── 02 / JARS SPECIFIC: Dashed Stitched Inner Border ── */}
        {category.id === "jars" && (
          <div
            className="absolute inset-2 sm:inset-3 rounded-2xl border-2 border-dashed border-[#3B2922]/35 pointer-events-none z-0"
            aria-hidden="true"
          />
        )}

        {/* ── HEADER BADGE / PILL ── */}
        <div className="relative z-10 flex items-center justify-center mb-4 sm:mb-5 pt-1">
          {/* Left comic tick marks for Jars & Waffles */}
          {category.id !== "boxes" && (
            <div className="flex gap-1 mr-2 opacity-80" aria-hidden="true">
              <span className="w-1.5 h-3 border-r-2 border-[#3B2922] -rotate-12 inline-block" />
              <span className="w-1.5 h-3 border-r-2 border-[#3B2922] -rotate-6 inline-block" />
            </div>
          )}

          {/* Badge Pill */}
          <div
            className={`px-4 sm:px-6 py-1 sm:py-1.5 rounded-full border-[2.5px] border-[#3B2922] shadow-[3px_3px_0px_#3B2922] flex items-center justify-center`}
            style={{
              backgroundColor: category.pillColor,
              color: category.id === "jars" ? "#3B2922" : "#FFFFFF",
            }}
          >
            <h3 className="font-cherry font-bold text-sm sm:text-base md:text-lg tracking-wider uppercase select-none">
              {category.badgeLabel}
            </h3>
          </div>

          {/* Right comic tick marks / burst */}
          <div className="flex gap-1 ml-2 opacity-80" aria-hidden="true">
            <span className="w-1.5 h-3 border-l-2 border-[#3B2922] rotate-6 inline-block" />
            <span className="w-1.5 h-3 border-l-2 border-[#3B2922] rotate-12 inline-block" />
          </div>
        </div>

        {/* ── PRODUCT ITEMS LIST ── */}
        <div className="relative z-10 space-y-0.5 sm:space-y-1" role="list">
          {category.products.map((product, idx) => (
            <MenuProductRow
              key={product.id}
              product={product}
              isLast={idx === category.products.length - 1}
              category={category.id}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM CORNER STICKERS ── */}
      {category.id === "boxes" && (
        <div
          className="absolute -bottom-3 -right-2 sm:-bottom-3 sm:-right-3 z-20 pointer-events-none drop-shadow select-none"
          aria-hidden="true"
        >
          <Image
            src="/images/menu-decor/heart-pink.svg"
            alt="Heart sticker"
            width={34}
            height={32}
            className="w-7 sm:w-8 md:w-9 h-auto rotate-12"
          />
        </div>
      )}

      {category.id === "waffles" && (
        <div
          className="absolute -bottom-3 -right-2 sm:-bottom-3 sm:-right-3 z-20 pointer-events-none drop-shadow select-none"
          aria-hidden="true"
        >
          <Image
            src="/images/menu-decor/heart-red.svg"
            alt="Red heart sticker"
            width={32}
            height={30}
            className="w-6 sm:w-7 md:w-8 h-auto rotate-6"
          />
        </div>
      )}
    </motion.div>
  );
}

