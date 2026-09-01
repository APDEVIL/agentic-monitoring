"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Doc } from "../../../convex/_generated/dataModel";

interface RecentIncidentCardProps {
  incident: Doc<"incidents">;
  projectId: string;
}

const statusBadge: Record<Doc<"incidents">["status"], { label: string; className: string }> = {
  detected: { label: "Queued", className: "bg-white/10 text-white/60" },
  diagnosing: { label: "Queued", className: "bg-white/10 text-white/60" },
  diagnosed: { label: "Queued", className: "bg-white/10 text-white/60" },
  resolution_proposed: { label: "Queued", className: "bg-yellow-500/10 text-yellow-300" },
  notified: { label: "Failed", className: "bg-red-500/10 text-red-300" },
  resolved: { label: "Success", className: "bg-lime-400/10 text-lime-300" },
};

export function RecentIncidentCard({ incident, projectId }: RecentIncidentCardProps) {
  const badge = statusBadge[incident.status];
  const Icon = incident.status === "resolved" ? CheckCircle2 : incident.severity === "critical" ? AlertCircle : Clock;

  return (
    <Link href={`/projects/${projectId}/runs/${incident._id}`}>
      <Card className="border-white/10 bg-white/[0.03] transition-colors hover:border-lime-400/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Icon className="h-3.5 w-3.5" />
            {new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <Badge className={badge.className} variant="outline">
            {badge.label}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-white">{incident.service}</p>
          <p className="mt-1 text-xs text-white/40">
            {incident.metric} = {incident.value} (threshold {incident.threshold})
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}