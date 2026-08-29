"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Radar, ShieldAlert, ShieldCheck } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { IncidentFeed } from "~/components/dashboard/incident-feed";
import { MetricsChart } from "~/components/dashboard/metrics-chart";
import { Card, CardContent } from "~/components/ui/card";

export default function DashboardPage() {
  const incidents = useQuery(api.incidents.list);

  const openCount = incidents?.filter((i) => i.status !== "resolved").length ?? 0;
  const criticalCount = incidents?.filter((i) => i.severity === "critical" && i.status !== "resolved").length ?? 0;
  const resolvedCount = incidents?.filter((i) => i.status === "resolved").length ?? 0;

  return (
    <div className="min-h-screen bg-[#050807] px-6 py-10 sm:px-10">
      <motion.div animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl" initial={{ opacity: 0, y: 12 }}>
        <div className="flex items-center gap-2 text-emerald-400">
          <Radar className="h-5 w-5" />
          <span className="text-sm font-medium">Sentinel / Dashboard</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Incident Overview</h1>
        <p className="mt-1 text-sm text-white/50">Live view of every incident detected across your monitored services.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-xs text-white/40">Open Incidents</p>
                <p className="mt-1 text-2xl font-semibold text-white">{openCount}</p>
              </div>
              <ShieldAlert className="h-6 w-6 text-yellow-400" />
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-xs text-white/40">Critical</p>
                <p className="mt-1 text-2xl font-semibold text-white">{criticalCount}</p>
              </div>
              <ShieldAlert className="h-6 w-6 text-red-400" />
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-xs text-white/40">Resolved</p>
                <p className="mt-1 text-2xl font-semibold text-white">{resolvedCount}</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-3 text-sm font-medium text-white/70">Recent Incidents</p>
            <IncidentFeed />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-white/70">Trends</p>
            <MetricsChart />
          </div>
        </div>
      </motion.div>
    </div>
  );
}