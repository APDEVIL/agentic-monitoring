"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";

const stats = [
  { label: "Incidents auto-resolved", value: 1284, suffix: "" },
  { label: "Avg. detection time", value: 4.2, suffix: "s", decimals: 1 },
  { label: "MTTR reduced", value: 63, suffix: "%" },
  { label: "Active monitors", value: 42, suffix: "" },
];

export function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-left">
          <div className="text-2xl font-semibold text-white">
            <CountUp
              end={stat.value}
              decimals={stat.decimals ?? 0}
              duration={2}
              suffix={stat.suffix}
            />
          </div>
          <div className="mt-1 text-xs text-white/50">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}