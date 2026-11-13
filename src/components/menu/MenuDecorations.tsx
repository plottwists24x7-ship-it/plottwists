"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { stickerPopVariants, idleFloatVariants } from "./menu-animations";

export function MenuDecorations() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* ── LEFT MARGIN DECORATIONS ── */}
      {/* Red Heart Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute left-4 lg:left-8 top-[38%] z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/heart-red.svg"
          alt="Red heart sticker"
          width={40}
          height={38}
          className="w-8 lg:w-10 h-auto -rotate-12 drop-shadow-sm"
        />
      </motion.div>

      {/* Yellow Star Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute left-6 lg:left-12 top-[58%] z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/star-yellow.svg"
          alt="Yellow star sparkle"
          width={40}
          height={40}
          className="w-8 lg:w-9 h-auto rotate-12 drop-shadow-sm"
        />
      </motion.div>

      {/* Freshly Made Just For You Scalloped Badge */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -left-4 xl:-left-8 bottom-32 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : idleFloatVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/images/menu-decor/freshly-made-badge.svg"
            alt="Freshly made, just for you badge"
            width={124}
            height={124}
            className="w-24 xl:w-28 h-auto -rotate-12 drop-shadow-md"
          />
        </motion.div>
      </motion.div>

      {/* ── BETWEEN JARS & WAFFLES (Center Gap Stickers) ── */}
      {/* Yellow Smiley Face Button */}
      <div
        className="hidden lg:block absolute right-[44%] top-[51%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/smiley-yellow.svg"
          alt="Yellow smiley button"
          width={52}
          height={52}
          className="w-11 lg:w-12 h-auto rotate-6 drop-shadow-md"
        />
      </div>

      {/* Pink Daisy Flower */}
      <div
        className="hidden lg:block absolute right-[3%] top-[49%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-pink.svg"
          alt="Pink flower sticker"
          width={48}
          height={48}
          className="w-10 lg:w-12 h-auto -rotate-12 drop-shadow-md"
        />
      </div>

      {/* ── TOP CORNER PAPERCLIP / SPARKLE ── */}
      <div
        className="hidden 2xl:block absolute right-8 top-12 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/tiny-sparkle.svg"
          alt="Tiny sparkle"
          width={28}
          height={28}
          className="w-6 h-6 rotate-45 opacity-70"
        />
      </div>
    </>
  );
}

