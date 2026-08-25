"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CakeSlice, 
  Images, 
  MessageSquareHeart, 
  LogOut, 
  ExternalLink,
  Sparkles,
  BookOpen,
  ChevronRight
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Hero Section",
    href: "/admin/hero",
    icon: Sparkles,
    badge: "Cover",
  },
  {
    label: "Story Images",
    href: "/admin/story",
    icon: BookOpen,
    badge: "Images",
  },
  {
    label: "Our Bakes",
    href: "/admin/bakes",
    icon: CakeSlice,
    badge: "Menu",
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Images,
    badge: null,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquareHeart,
    badge: null,
  },
  {
    label: "Instagram CTA",
    href: "/admin/instagram",
    icon: Sparkles,
    badge: "Social",
  },
];

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    router.push("/admin/login");
  };

  return (
    <aside className="w-72 bg-[#FFFDF8] border-r-[4px] border-[#3E2A24] flex flex-col justify-between h-full select-none">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 border-b-[3px] border-[#3E2A24]/20 bg-[#FFECC8]/40">
          <Link 
            href="/admin/dashboard" 
            onClick={onCloseMobile}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF4FA3] border-[3px] border-[#3E2A24] flex items-center justify-center text-2xl shadow-[3px_3px_0_#3E2A24] transform -rotate-3 group-hover:rotate-0 transition-transform">
              🧁
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bowlby text-xl text-[#3E2A24] tracking-tight">
                  PlotTwist
                </span>
                <span className="bg-[#FFE26E] text-[#3E2A24] text-[10px] font-bricolage font-black px-1.5 py-0.5 rounded-full border border-[#3E2A24] uppercase">
                  Admin
                </span>
              </div>
              <p className="font-kalam text-xs text-[#5F4A3A] font-semibold">
                Bakery Studio Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          <div className="px-3 py-2 text-[11px] font-bricolage font-extrabold uppercase tracking-widest text-[#3E2A24]/60">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bricolage font-bold text-sm transition-all ${
                  isActive
                    ? "bg-[#FFE26E] text-[#3E2A24] border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] translate-x-1"
                    : "text-[#5F4A3A] hover:bg-[#FFECC8]/60 hover:text-[#3E2A24] border-[3px] border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#3E2A24]" : "text-[#5F4A3A]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#FF4FA3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#3E2A24]">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <ChevronRight className="w-4 h-4 text-[#3E2A24]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t-[3px] border-[#3E2A24]/20 space-y-3 bg-[#FFF9F5]">
        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bricolage font-bold text-[#3E2A24] bg-[#FFECC8] border-[2px] border-[#3E2A24] hover:bg-[#FFE26E] shadow-[2px_2px_0_#3E2A24] transition-all"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
            <span>View Public Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Owner Profile Card */}
        <div className="p-3 bg-[#FFFDF8] rounded-2xl border-[3px] border-[#3E2A24] flex items-center justify-between shadow-[3px_3px_0_#3E2A24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center font-bold text-lg">
              👩‍🍳
            </div>
            <div>
              <p className="font-bricolage font-bold text-sm text-[#3E2A24] leading-tight">
                Head Baker
              </p>
              <p className="font-kalam text-xs text-[#5F4A3A]">
                Single Owner Mode
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
