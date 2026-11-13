"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { stickerPopVariants, idleFloatVariants } from "./menu-animations";

export function MenuDecorations() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* ── LEFT MARGIN DECORATIONS (Placed in Gutter Outside Content) ── */}
      {/* Red Heart Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden 2xl:block absolute left-8 top-[36%] z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/heart-red.svg"
          alt=""
          width={34}
          height={32}
          style={{ width: "auto", height: "auto" }}
          className="w-7 lg:w-8 rotate-[-12deg] drop-shadow-xs"
        />
      </motion.div>

      {/* Yellow Star Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden 2xl:block absolute left-10 top-[55%] z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/star-yellow.svg"
          alt=""
          width={32}
          height={32}
          style={{ width: "auto", height: "auto" }}
          className="w-6 lg:w-7 rotate-[12deg] drop-shadow-xs"
        />
      </motion.div>

      {/* Freshly Made Just For You Scalloped Badge (Bottom Left Gutter) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute left-4 2xl:left-10 bottom-16 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : idleFloatVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/images/menu-decor/freshly-made-badge.svg"
            alt="Freshly made badge"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }}
            className="w-20 xl:w-22 rotate-[-12deg] drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* ── BETWEEN JARS & WAFFLES (Center Gap Stickers) ── */}
      {/* Yellow Smiley Face Button */}
      <div
        className="hidden lg:block absolute right-[42%] top-[48%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/smiley-yellow.svg"
          alt=""
          width={44}
          height={44}
          style={{ height: "auto" }}
          className="w-9 lg:w-10 h-auto rotate-6 drop-shadow-sm"
        />
      </div>

      {/* Pink Daisy Flower */}
      <div
        className="hidden lg:block absolute right-[2%] top-[46%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-pink.svg"
          alt=""
          width={40}
          height={40}
          style={{ height: "auto" }}
          className="w-8 lg:w-9 h-auto -rotate-12 drop-shadow-sm"
        />
      </div>

      {/* ── TOP RIGHT CORNER SPARKLE ── */}
      <div
        className="hidden 2xl:block absolute right-8 top-8 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/tiny-sparkle.svg"
          alt=""
          width={22}
          height={22}
          className="w-5 h-5 rotate-45 opacity-65"
        />
      </div>
    </>
  );
}
