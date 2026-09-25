"use client";

import { useQuery } from "convex/react";
import { Bot, Search, ShieldCheck, Wrench } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface ActiveAgentsCardProps {
  projectId: Id<"projects">;
}

const agentMeta: Record<string, { label: string; icon: typeof Bot; sub: string }> = {
  detection: { label: "Detection Agent", icon: Search, sub: "Threshold checks" },
  diagnosis: { label: "Diagnosis Agent", icon: Bot, sub: "Root cause analysis" },
  resolution: { label: "Resolution Agent", icon: Wrench, sub: "Fix suggestions" },
  notification: { label: "Notification Agent", icon: ShieldCheck, sub: "Team alerts" },
};

const statusDot: Record<string, string> = {
  running: "bg-lime-400 animate-pulse",
  idle: "bg-white/30",
  error: "bg-red-400",
};

export function ActiveAgentsCard({ projectId }: ActiveAgentsCardProps) {
  const agents = useQuery(api.agentStatus.list, { projectId });

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-white/70">Active Agents</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {agents?.map((agent) => {
          const meta = agentMeta[agent.agent];
          if (!meta) return null;
          return (
            <div className="flex items-center justify-between" key={agent.agent}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/70">
                  <meta.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-white">{meta.label}</p>
                  <p className="text-xs text-white/40">{meta.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className={cn("h-2 w-2 rounded-full", statusDot[agent.status])} />
                <span className="capitalize">{agent.status}</span>
                <span className="text-white/30">· {agent.todayCount} tasks</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 