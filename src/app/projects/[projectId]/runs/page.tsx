"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export default function RunsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId: rawProjectId } = use(params);
  const projectId = rawProjectId as Id<"projects">;
  const checks = useQuery(api.checks.listByProject, { projectId });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-xl font-semibold text-white">All Runs</h1>
      <p className="mt-1 text-sm text-white/40">Every check this project has recorded, most recent first.</p>

      <div className="mt-6 space-y-2">
        {checks === undefined ? (
          skeletonIds.map((id) => <Skeleton className="h-14 w-full rounded-xl bg-white/5" key={id} />)
        ) : checks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 py-16 text-center text-sm text-white/30">
            No runs yet — the poller checks every 30 seconds.
          </p>
        ) : (
          checks.map((check) => (
            <Card className="border-white/10 bg-white/[0.03]" key={check._id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {check.success ? (
                    <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm text-white">{check.service}</span>
                  <span className="text-xs text-white/40">status {check.statusCode}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{check.latencyMs}ms</span>
                  <span>{new Date(check.checkedAt).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}