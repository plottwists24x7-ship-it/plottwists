"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MenuProductItem, MenuCategoryType } from "./menu-data";
import { productRowVariants } from "./menu-animations";

interface MenuProductRowProps {
  product: MenuProductItem;
  isLast?: boolean;
  category: MenuCategoryType;
  nameFontClass: string;
}

export function MenuProductRow({
  product,
  isLast = false,
  category,
  nameFontClass,
}: MenuProductRowProps) {
  const shouldReduceMotion = useReducedMotion();

  // Subtle separator color per paper tone
  const dividerBorderColor =
    category === "boxes"
      ? "border-[#3B2922]/20"
      : category === "jars"
      ? "border-[#3B2922]/20"
      : "border-[#3B2922]/25";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : productRowVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { x: 3, transition: { duration: 0.16, ease: "easeOut" } }
      }
      className={`group py-1 sm:py-1.5 transition-colors ${
        !isLast ? `border-b ${dividerBorderColor}` : ""
      }`}
      role="listitem"
    >
      {/* ── ROW TOP: NAME (Left) & PRICE (Right) LOCKED ON SAME BASELINE ── */}
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-2.5">
        <h4
          className={`${nameFontClass} text-[14px] sm:text-[15px] md:text-base text-[#3B2922] leading-tight select-text group-hover:text-[#1F1410] transition-colors`}
        >
          {product.name}
        </h4>
        <span className="font-space font-bold text-[14px] sm:text-[15px] md:text-base text-[#3B2922] tabular-nums whitespace-nowrap text-right select-text shrink-0">
          {product.price}
        </span>
      </div>

      {/* ── ROW BOTTOM: DESCRIPTION DIRECTLY UNDERNEATH ── */}
      <p className="font-dmsans text-[11px] sm:text-[12px] md:text-[12.5px] text-[#5A453A] leading-relaxed mt-0.5 tracking-normal select-text">
        {product.description}
      </p>
    </motion.div>
  );
}
