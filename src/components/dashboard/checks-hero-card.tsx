"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "~/components/ui/button";

interface ChecksHeroCardProps {
  projectId: Id<"projects">;
}

export function ChecksHeroCard({ projectId }: ChecksHeroCardProps) {
  const stats = useQuery(api.incidents.getProjectStats, { projectId });
  const agents = useQuery(api.agentStatus.list, { projectId });
  const checksRun = agents?.find((a) => a.agent === "detection")?.todayCount ?? 0;
  const successRate = stats?.successRate ?? 100;

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-300 to-lime-500 p-6"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-lime-900/70">Checks completed</p>
          <p className="mt-2 text-4xl font-semibold text-lime-950">{checksRun.toLocaleString()}</p>
          <p className="mt-1 text-xs text-lime-900/60">{stats?.todayCount ?? 0} incidents flagged today</p>
        </div>

        <div className="relative h-24 w-24">
          <svg className="h-full w-full -rotate-90" role="img" viewBox="0 0 100 100">
            <title>{`${successRate}% success rate`}</title>
            <circle cx="50" cy="50" fill="none" r="42" stroke="rgba(0,0,0,0.12)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="42"
              stroke="#132a13"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-lime-950">
            {successRate}%
          </div>
        </div>
      </div>

      <Button
        className="mt-6 bg-lime-950 text-lime-200 hover:bg-lime-900"
        render={<Link href={`/projects/${projectId}/runs`} />}
        size="sm"
      >
        <PlayCircle className="mr-2 h-4 w-4" /> Watch live runs
      </Button>
    </motion.div>
  );
}
