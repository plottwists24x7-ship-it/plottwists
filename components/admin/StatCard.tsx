"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  bgColor: string;
  href?: string;
  description?: string;
}

export function StatCard({ label, value, icon, bgColor, href, description }: StatCardProps) {
  const content = (
    <div className={`p-6 rounded-3xl border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_#3E2A24] relative overflow-hidden group ${bgColor}`}>
      {/* Background paper dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" width="100%" height="100%">
        <pattern id={`stat-dots-${label.replace(/\s+/g, '')}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#3E2A24" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#stat-dots-${label.replace(/\s+/g, '')})`} />
      </svg>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24]/70 block mb-1">
            {label}
          </span>
          <div className="font-bowlby text-4xl sm:text-5xl text-[#3E2A24] tracking-tight leading-none my-2">
            {value}
          </div>
          {description && (
            <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] font-semibold mt-2">
              {description}
            </p>
          )}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] flex items-center justify-center text-3xl transform group-hover:rotate-6 transition-transform shrink-0">
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t-2 border-[#3E2A24]/20 flex items-center justify-between text-xs font-bricolage font-bold text-[#3E2A24]">
          <span>Manage {label}</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
