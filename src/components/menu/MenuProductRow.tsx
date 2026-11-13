"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MenuProductItem, MenuCategoryType } from "./menu-data";
import { productRowVariants } from "./menu-animations";

interface MenuProductRowProps {
  product: MenuProductItem;
  isLast?: boolean;
  category: MenuCategoryType;
}

export function MenuProductRow({
  product,
  isLast = false,
  category,
}: MenuProductRowProps) {
  const shouldReduceMotion = useReducedMotion();

  // Subtle separator color per paper tone
  const dividerBorderColor =
    category === "boxes"
      ? "border-[#3B2922]/25"
      : category === "jars"
      ? "border-[#3B2922]/25"
      : "border-[#3B2922]/30";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : productRowVariants}
      initial="initial"
      whileHover={shouldReduceMotion ? undefined : "hover"}
      className={`group py-2 md:py-2.5 transition-colors ${
        !isLast ? `border-b ${dividerBorderColor}` : ""
      }`}
      role="listitem"
    >
      {/* Top Line: Item Name and Aligned Price */}
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-fredoka font-bold text-[15px] sm:text-base md:text-[17px] text-[#3B2922] tracking-wide leading-tight group-hover:text-[#201511] transition-colors">
          {product.name}
        </h4>
        <span className="font-fredoka font-bold text-[15px] sm:text-base md:text-[17px] text-[#3B2922] tracking-tight shrink-0 select-text">
          {product.price}
        </span>
      </div>

      {/* Bottom Line: Description */}
      <p className="font-fredoka text-xs sm:text-[13px] md:text-sm text-[#503E33] leading-relaxed mt-0.5 tracking-normal opacity-90">
        {product.description}
      </p>
    </motion.div>
  );
}

