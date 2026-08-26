"use client";

import React from "react";
import { AdminProvider } from "@/context/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      {isLoginPage ? (
        <div className="min-h-screen bg-[#FFF6E8] text-[#3E2A24]">
          {children}
        </div>
      ) : (
        <div className="min-h-screen bg-[#FFF6E8] text-[#3E2A24] flex overflow-x-hidden">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0">
            <AdminSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <AdminHeader />
            <main className="flex-1 p-3 sm:p-5 lg:p-6 relative">
              {/* Subtle Paper Dot Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" width="100%" height="100%">
                <pattern id="admin-bg-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.3" fill="rgba(62,42,36,0.15)" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#admin-bg-dots)" />
              </svg>

              <div className="max-w-7xl mx-auto relative z-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
