"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Doc } from "../../../convex/_generated/dataModel";

const severityStyles: Record<Doc<"incidents">["severity"], string> = {
  warning: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  critical: "bg-red-500/10 text-red-300 border-red-500/30",
};

const statusLabels: Record<Doc<"incidents">["status"], string> = {
  detected: "Detected",
  diagnosing: "Diagnosing",
  diagnosed: "Diagnosed",
  resolution_proposed: "Fix Proposed",
  notified: "Notified",
  resolved: "Resolved",
};

interface IncidentCardProps {
  incident: Doc<"incidents">;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} initial={{ opacity: 0, y: 12 }} layout>
      <Link href={`/dashboard/${incident._id}`}>
        <Card className="border-white/10 bg-white/[0.03] transition-colors hover:border-emerald-400/30 hover:bg-white/[0.05]">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={cn("h-4 w-4", incident.severity === "critical" ? "text-red-400" : "text-yellow-400")}
              />
              <span className="font-medium text-white">{incident.service}</span>
            </div>
            <Badge className={severityStyles[incident.severity]} variant="outline">
              {incident.severity}
            </Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-white/60">
              {incident.metric} = {incident.value} (threshold {incident.threshold})
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatTimeAgo(incident.createdAt)}
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                {statusLabels[incident.status]} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}