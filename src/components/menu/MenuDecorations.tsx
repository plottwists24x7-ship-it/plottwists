"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { stickerPopVariants, idleFloatVariants } from "./menu-animations";

export function MenuDecorations() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* ════════ AREA A: LEFT OF 01 / BOXES (Gutter Margins) ════════ */}
      {/* 1. Handwritten Baker's Daily Pick Note Tape */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-16 2xl:-left-20 top-[8%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/scrapbook-tape-note.svg"
          alt="Baker's Daily Pick note"
          width={120}
          height={48}
          className="w-24 2xl:w-28 h-auto rotate-[-4deg] drop-shadow-xs"
        />
      </motion.div>

      {/* 2. Large Fudgy Brownie Cluster (Stacked Squares) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -left-14 xl:-left-18 top-[24%] z-25 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : idleFloatVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/images/menu-decor/doodle-brownie-cluster.svg"
            alt="Stacked brownie squares"
            width={80}
            height={75}
            className="w-16 xl:w-18 h-auto rotate-[-8deg] drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* 3. Red Heart Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-10 2xl:-left-12 top-[46%] z-20 pointer-events-none select-none"
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

      {/* 4. Yellow 4-Point Star Sticker */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-12 top-[58%] z-20 pointer-events-none select-none"
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

      {/* ════════ AREA B: ABOVE 01 / BOXES (Top Edge Accents) ════════ */}
      {/* Small Wooden Rolling Pin */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute left-[44%] -top-5 z-20 pointer-events-none select-none opacity-85"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-rolling-pin.svg"
          alt=""
          width={65}
          height={26}
          className="w-14 h-auto rotate-[-14deg] drop-shadow-xs"
        />
      </motion.div>

      {/* ════════ AREA C: BETWEEN BOXES & RIGHT COLUMN (Center Gap) ════════ */}
      {/* 1. Yellow Smiley Face Button */}
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

      {/* 2. Playful Curly Arrow Doodle Pointing to Jars/Waffles */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute left-[56%] top-[38%] -translate-x-1/2 z-25 pointer-events-none select-none opacity-80"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/sticker-arrow-doodle.svg"
          alt=""
          width={45}
          height={40}
          className="w-7 h-auto rotate-[8deg] drop-shadow-xs"
        />
      </motion.div>

      {/* ════════ AREA D: RIGHT OF 02 / JARS (Upper Right Gutter) ════════ */}
      {/* 1. Scalloped "Slow Churned Daily" Oval Label */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -right-14 2xl:-right-18 top-[4%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/scrapbook-label-slowchurned.svg"
          alt="Slow churned label"
          width={90}
          height={32}
          className="w-20 2xl:w-22 h-auto rotate-[-2deg] drop-shadow-xs"
        />
      </motion.div>

      {/* 2. Layered Biscoff Dessert Jar Illustration */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -right-14 xl:-right-18 top-[14%] z-25 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : idleFloatVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/images/menu-decor/doodle-biscoff-jar.svg"
            alt="Biscoff dessert jar"
            width={75}
            height={90}
            className="w-14 xl:w-16 h-auto rotate-[8deg] drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* 3. Glossy Red Cherries Pair */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -right-10 top-[34%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-cherries-pair.svg"
          alt="Cherries"
          width={50}
          height={50}
          className="w-9 h-auto rotate-[-8deg] drop-shadow-xs"
        />
      </motion.div>

      {/* ════════ AREA E: BETWEEN 02 / JARS & 03 / WAFFLES (Right Gap) ════════ */}
      {/* 1. Pink Daisy Flower */}
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

      {/* 2. Sparkle Accent */}
      <div
        className="hidden xl:block absolute right-10 top-[47%] z-20 pointer-events-none select-none opacity-70"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/tiny-sparkle.svg"
          alt=""
          width={22}
          height={22}
          className="w-4 h-auto rotate-45"
        />
      </div>

      {/* ════════ AREA F: RIGHT OF 03 / WAFFLES (Lower Right Gutter) ════════ */}
      {/* 1. Golden Crisp Waffle with Syrup & Butter */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -right-14 xl:-right-18 top-[64%] z-25 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : idleFloatVariants}
          initial="initial"
          animate="animate"
        >
          <Image
            src="/images/menu-decor/doodle-waffle-syrup.svg"
            alt="Waffle with syrup"
            width={80}
            height={80}
            className="w-15 xl:w-17 h-auto rotate-[-6deg] drop-shadow-sm"
          />
        </motion.div>
      </motion.div>

      {/* 2. Powder Blue Flower */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -right-10 top-[88%] z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-blue.svg"
          alt=""
          width={34}
          height={34}
          className="w-7 h-auto rotate-12 drop-shadow-xs"
        />
      </motion.div>

      {/* ════════ AREA G: BOTTOM OF 01 / BOXES (Lower Left Gutter) ════════ */}
      {/* 1. Freshly Made Just For You Scalloped Cloud Badge */}
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

      {/* 2. Chocolate Mocha Pudding Jar (Tucked near bottom left) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden xl:block absolute -left-14 bottom-0 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-choco-pudding-jar.svg"
          alt="Mocha pudding jar"
          width={70}
          height={85}
          className="w-13 h-auto rotate-[8deg] drop-shadow-xs"
        />
      </motion.div>

      {/* 3. Pink Daisy Flower (Gutter corner) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden lg:block absolute -left-8 lg:-left-10 -bottom-3 z-20 pointer-events-none select-none"
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
    </>
  );
}
