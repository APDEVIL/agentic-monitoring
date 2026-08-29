"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Navbar } from "./navbar";
import { DotGridBackground } from "./dot-grid-background";
import { SpotlightCursor } from "./spotlight-cursor";
import { HeroStats } from "./hero-stats";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <SpotlightCursor
      className="min-h-screen bg-[#050807]"
      size={600}
      color="rgba(16, 185, 129, 0.12)"
    >
      <DotGridBackground />

      <div className="relative">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 pb-8 pt-16 text-center sm:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold leading-tight text-white sm:text-6xl"
          >
            Know What&apos;s Really
            <br />
            Happening in Your Infrastructure
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-white/60"
          >
            Multi-agent AI that watches your services, diagnoses root causes,
            and proposes the fix — before your on-call engineer even opens
            Slack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="bg-emerald-400 text-black hover:bg-emerald-300">
              Start Monitoring <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/15 text-white hover:bg-white/5">
              <PlayCircle className="mr-2 h-4 w-4" /> See a Live Demo
            </Button>
          </motion.div>
        </div>

        <div className="px-6">
          <DashboardPreview />
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16">
          <HeroStats />
        </div>
      </div>
    </SpotlightCursor>
  );
}