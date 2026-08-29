"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "~/components/ui/skeleton";

interface DayBucket {
  day: string;
  warning: number;
  critical: number;
}

export function MetricsChart() {
  const incidents = useQuery(api.incidents.list);

  const data = useMemo<DayBucket[]>(() => {
    if (!incidents) return [];

    const buckets = new Map<string, DayBucket>();
    for (const incident of incidents) {
      const day = new Date(incident.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const bucket = buckets.get(day) ?? { day, warning: 0, critical: 0 };
      bucket[incident.severity] += 1;
      buckets.set(day, bucket);
    }
    return Array.from(buckets.values()).reverse();
  }, [incidents]);

  if (incidents === undefined) {
    return <Skeleton className="h-64 w-full rounded-xl bg-white/5" />;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-4 text-sm text-white/50">Incidents by Day</p>
      <ResponsiveContainer height={240} width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="day" fontSize={11} stroke="#ffffff40" />
          <YAxis allowDecimals={false} fontSize={11} stroke="#ffffff40" />
          <Tooltip
            contentStyle={{
              background: "#0b0f0e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="warning" fill="#facc15" radius={[4, 4, 0, 0]} stackId="severity" />
          <Bar dataKey="critical" fill="#f87171" radius={[4, 4, 0, 0]} stackId="severity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}