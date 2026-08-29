"use client";

import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "~/components/ui/skeleton";
import { IncidentCard } from "./incident-card";

const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export function IncidentFeed() {
  const incidents = useQuery(api.incidents.list);

  if (incidents === undefined) {
    return (
      <div className="space-y-3">
        {skeletonIds.map((id) => (
          <Skeleton className="h-28 w-full rounded-xl bg-white/5" key={id} />
        ))}
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] py-16 text-white/40">
        <Inbox className="h-8 w-8" />
        <p className="text-sm">No incidents yet — your systems are healthy.</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-3" layout>
      <AnimatePresence mode="popLayout">
        {incidents.map((incident) => (
          <IncidentCard incident={incident} key={incident._id} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}