"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface SeverityDistributionBarProps {
  projectId: Id<"projects">;
}

export function SeverityDistributionBar({ projectId }: SeverityDistributionBarProps) {
  const incidents = useQuery(api.incidents.listByProject, { projectId });

  const breakdown = useMemo(() => {
    const total = incidents?.length ?? 0;
    if (!incidents || total === 0) return { critical: 0, warning: 0, resolved: 0, total: 0 };

    const critical = incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length;
    const resolved = incidents.filter((i) => i.status === "resolved").length;
    const warning = total - critical - resolved;

    return { critical, warning, resolved, total };
  }, [incidents]);

  const pct = (value: number) => (breakdown.total === 0 ? 0 : Math.round((value / breakdown.total) * 100));

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-white/70">Incident Distribution</p>
      </CardHeader>
      <CardContent>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div className="bg-red-400" style={{ width: `${pct(breakdown.critical)}%` }} />
          <div className="bg-yellow-400" style={{ width: `${pct(breakdown.warning)}%` }} />
          <div className="bg-lime-400" style={{ width: `${pct(breakdown.resolved)}%` }} />
        </div>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-400" /> Critical
            </span>
            <span>{pct(breakdown.critical)}%</span>
          </div>
          <div className="flex items-center justify-between text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400" /> Warning
            </span>
            <span>{pct(breakdown.warning)}%</span>
          </div>
          <div className="flex items-center justify-between text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime-400" /> Resolved
            </span>
            <span>{pct(breakdown.resolved)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}