"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF6E8] text-[#3E2A24]">
      <div className="text-center font-bricolage font-bold animate-pulse">
        <span className="text-3xl">🧁</span>
        <p className="mt-2 text-sm text-[#5F4A3A]">Entering PlotTwist24x Admin...</p>
      </div>
    </div>
  );
}
