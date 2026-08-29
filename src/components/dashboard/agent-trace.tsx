"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Bot, Search, ShieldCheck, Wrench } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const agentIcons: Record<Doc<"agentSteps">["agent"], typeof Bot> = {
  detection: Search,
  diagnosis: Bot,
  resolution: Wrench,
  notification: ShieldCheck,
};

const agentLabels: Record<Doc<"agentSteps">["agent"], string> = {
  detection: "Detection Agent",
  diagnosis: "Diagnosis Agent",
  resolution: "Resolution Agent",
  notification: "Notification Agent",
};

const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3"];

interface AgentTraceProps {
  incidentId: Id<"incidents">;
}

export function AgentTrace({ incidentId }: AgentTraceProps) {
  const steps = useQuery(api.incidents.getSteps, { incidentId });

  if (steps === undefined) {
    return (
      <div className="space-y-4">
        {skeletonIds.map((id) => (
          <Skeleton className="h-16 w-full rounded-lg bg-white/5" key={id} />
        ))}
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/40">
        No agent activity recorded for this incident yet.
      </p>
    );
  }

  return (
    <div className="relative space-y-6 pl-6">
      <div className="absolute bottom-0 left-[9px] top-1 w-px bg-white/10" />

      {steps.map((step, index) => {
        const Icon = agentIcons[step.agent];
        return (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="relative"
            initial={{ opacity: 0, x: -12 }}
            key={step._id}
            transition={{ delay: index * 0.08 }}
          >
            <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/40 bg-[#0b0f0e] text-emerald-300">
              <Icon className="h-3 w-3" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{agentLabels[step.agent]}</span>
                <span className="text-xs text-white/40">
                  {new Date(step.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className={cn("mt-1 break-words text-xs text-white/60")}>{step.output}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}