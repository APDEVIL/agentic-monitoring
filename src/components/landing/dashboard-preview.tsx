"use client";

import { motion } from "framer-motion";
import { Activity, Bell, LayoutGrid, Radar, Settings, ShieldCheck } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const chartData = [
  { time: "00:00", incidents: 2 },
  { time: "04:00", incidents: 1 },
  { time: "08:00", incidents: 5 },
  { time: "12:00", incidents: 3 },
  { time: "16:00", incidents: 7 },
  { time: "20:00", incidents: 2 },
  { time: "24:00", incidents: 1 },
];

const sidebarItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Monitors", icon: Radar },
  { label: "Activity", icon: Activity },
  { label: "Security", icon: ShieldCheck },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings },
];

const statCards = [
  { label: "System Health", value: "98%", trend: "+2.1%" },
  { label: "Active Incidents", value: "3", trend: "-40%" },
  { label: "Avg. Resolution", value: "4.2m", trend: "-18%" },
  { label: "Monitors Online", value: "42/42", trend: "100%" },
];

export function DashboardPreview() {
  return (
    <motion.div
      className="relative mx-auto mt-16 w-full max-w-5xl"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f0e]/90 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs text-white/40">
              Sentinel / Overview / Incident Summary
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col items-center gap-4 border-r border-white/10 px-3 py-6">
            {sidebarItems.map((item, i) => (
              <div
                key={item.label}
                className={`rounded-lg p-2 ${
                  i === 0 ? "bg-emerald-500/15 text-emerald-300" : "text-white/40"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </div>
            ))}
          </div>

          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="text-xs text-white/40">{card.label}</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {card.value}
                  </div>
                  <div className="mt-1 text-xs text-emerald-400">
                    {card.trend} last 30 days
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 text-xs text-white/50">
                Incident Trends Over Time
              </div>
              <ResponsiveContainer height={160} width="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="incidentGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" fontSize={10} stroke="#ffffff30" />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0f0e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    dataKey="incidents"
                    fill="url(#incidentGradient)"
                    stroke="#34d399"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}