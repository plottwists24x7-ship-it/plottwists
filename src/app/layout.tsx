import type { Metadata } from "next";
import { Lilita_One, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";

const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plotwist — Baked slowly. Loved loudly.",
  description:
    "A vibrant, scroll-driven bakery experience crafting handmade desserts and small-batch bakes with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lilita.variable} ${jakarta.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-canvas-base text-[#3D2E25] font-sans antialiased overflow-x-hidden border-[12px] border-[#3D2E25] relative">
        {/* Subtle noise grain texture overlaying the entire site */}
        <div className="linen-grain-overlay pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
