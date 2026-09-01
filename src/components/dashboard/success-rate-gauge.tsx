"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface SuccessRateGaugeProps {
  projectId: Id<"projects">;
}

export function SuccessRateGauge({ projectId }: SuccessRateGaugeProps) {
  const stats = useQuery(api.incidents.getProjectStats, { projectId });
  const rate = stats?.successRate ?? 100;

  const radius = 60;
  const circumference = Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-white/70">Success Rate</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <svg height="80" role="img" viewBox="0 0 140 80" width="140">
          <title>{`${rate}% of incidents resolved`}</title>
          <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeLinecap="round" strokeWidth="12" />
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke="#a3e635"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="12"
          />
        </svg>
        <p className="-mt-4 text-2xl font-semibold text-white">{rate}%</p>
        <p className="mt-1 text-xs text-white/40">
          {stats?.resolvedCount ?? 0} resolved · {stats?.criticalCount ?? 0} failing now
        </p>
      </CardContent>
    </Card>
  );
}