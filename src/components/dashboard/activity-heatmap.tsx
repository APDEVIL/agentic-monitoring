"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface ActivityHeatmapProps {
  projectId: Id<"projects">;
}

const DAYS_TO_SHOW = 35;
const WEEKDAYS = [
  { id: "sun", label: "S" },
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
];

function intensityClass(count: number) {
  if (count === 0) return "bg-white/[0.04]";
  if (count <= 2) return "bg-lime-400/25";
  if (count <= 5) return "bg-lime-400/55";
  return "bg-lime-400";
}

export function ActivityHeatmap({ projectId }: ActivityHeatmapProps) {
  const incidents = useQuery(api.incidents.listByProject, { projectId });

  const cells = useMemo(() => {
    const counts = new Map<string, number>();
    for (const incident of incidents ?? []) {
      const key = new Date(incident.createdAt).toDateString();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (DAYS_TO_SHOW - 1 - i));
      return { date, count: counts.get(date.toDateString()) ?? 0 };
    });
  }, [incidents]);

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-sm font-medium text-white/70">Runs Activity</p>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <span className="h-2 w-2 rounded-sm bg-white/[0.04]" /> Low
          <span className="ml-2 h-2 w-2 rounded-sm bg-lime-400/55" /> Medium
          <span className="ml-2 h-2 w-2 rounded-sm bg-lime-400" /> High
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => (
            <div
              className={cn("h-4 w-4 rounded-sm", intensityClass(cell.count))}
              key={cell.date.toISOString()}
              title={`${cell.date.toLocaleDateString()}: ${cell.count} incidents`}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-1 text-[10px] text-white/30">
          {WEEKDAYS.map((day) => (
            <span className="w-4 text-center" key={day.id}>
              {day.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}