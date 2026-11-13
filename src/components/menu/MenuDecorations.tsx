"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { stickerPopVariants, idleFloatVariants } from "./menu-animations";

export function MenuDecorations() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* ── LEFT MARGIN DECORATIONS (Frame the 01 / BOXES Card) ── */}
      {/* Red Heart Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-12 lg:-left-14 top-[32%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/heart-red.svg"
          alt=""
          width={34}
          height={32}
          className="w-7 lg:w-8 h-auto rotate-[-12deg] drop-shadow-xs"
        />
      </motion.div>

      {/* Yellow 4-Point Star Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-10 lg:-left-12 top-[52%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/star-yellow.svg"
          alt=""
          width={32}
          height={32}
          className="w-6 lg:w-7 h-auto rotate-[14deg] drop-shadow-xs"
        />
      </motion.div>

      {/* Freshly Made Just For You Scalloped Cloud Badge */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -left-16 xl:-left-20 bottom-14 z-25 pointer-events-none select-none"
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
            width={110}
            height={110}
            className="w-20 xl:w-24 h-auto rotate-[-12deg] drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* Pink Flower Sticker (Bottom Left Gutter) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -left-8 lg:-left-10 -bottom-2 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-pink.svg"
          alt=""
          width={36}
          height={36}
          className="w-7 lg:w-8 h-auto rotate-12 drop-shadow-xs"
        />
      </motion.div>

      {/* ── BETWEEN 01 / BOXES & 03 / WAFFLES (Center Gap Stickers) ── */}
      {/* Yellow Smiley Face Button */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute left-[56.5%] top-[48.5%] -translate-x-1/2 z-30 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/smiley-yellow.svg"
          alt=""
          width={40}
          height={40}
          className="w-8 lg:w-9 h-auto rotate-6 drop-shadow-sm"
        />
      </motion.div>

      {/* ── BETWEEN 02 / JARS & 03 / WAFFLES (Right Gap Sticker) ── */}
      {/* Pink Daisy Flower */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -right-3 top-[46%] z-30 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-pink.svg"
          alt=""
          width={38}
          height={38}
          className="w-8 lg:w-9 h-auto -rotate-12 drop-shadow-sm"
        />
      </motion.div>

      {/* ── RIGHT MARGIN BAKERY DOODLES (Gutter Outside Right Column) ── */}
      {/* Floating Dessert Jar Doodle */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -right-14 top-[22%] z-20 pointer-events-none select-none opacity-80"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-jar.svg"
          alt=""
          width={36}
          height={42}
          className="w-8 h-auto rotate-12 drop-shadow-xs"
        />
      </motion.div>

      {/* Floating Waffle Doodle */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -right-12 top-[68%] z-20 pointer-events-none select-none opacity-80"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-waffle.svg"
          alt=""
          width={38}
          height={38}
          className="w-8 h-auto -rotate-6 drop-shadow-xs"
        />
      </motion.div>

      {/* Floating Brownie Doodle near Freshly Made Badge */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-14 bottom-2 z-20 pointer-events-none select-none opacity-80"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-brownie.svg"
          alt=""
          width={36}
          height={34}
          className="w-7 h-auto rotate-[-10deg] drop-shadow-xs"
        />
      </motion.div>
    </>
  );
}
