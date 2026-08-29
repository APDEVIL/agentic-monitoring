"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const navLinks = [
  { label: "Detect", href: "#detect", count: "01" },
  { label: "Diagnose", href: "#diagnose", count: "02" },
  { label: "Resolve", href: "#resolve", count: "03" },
];

const rightLinks: { label: string; href: string; count?: number }[] = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers", count: 3 },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 flex items-center justify-between px-8 py-5"
    >
      <Link href="/" className="flex items-center gap-2 text-white">
        <Radar className="h-5 w-5 text-emerald-400" />
        <span className="text-lg font-semibold tracking-tight">Sentinel</span>
      </Link>

      <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.label}
            <span className="text-xs text-white/40">{link.count}</span>
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-6 md:flex">
        {rightLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            {link.label}
            {link.count ? (
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {link.count}
              </Badge>
            ) : null}
          </Link>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
        >
          Start Free Trial
        </Button>
        <Button size="sm" className="bg-white text-black hover:bg-white/90">
          Book a Call
        </Button>
      </div>
    </motion.header>
  );
}