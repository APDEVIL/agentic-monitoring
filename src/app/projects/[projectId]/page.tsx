"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Topbar, type TimeRange } from "~/components/layout/topbar";
import { ChecksHeroCard } from "~/components/dashboard/checks-hero-card";
import { ActiveAgentsCard } from "~/components/dashboard/active-agents-card";
import { UsageChart } from "~/components/dashboard/usage-chart";
import { SuccessRateGauge } from "~/components/dashboard/success-rate-gauge";
import { ActivityHeatmap } from "~/components/dashboard/activity-heatmap";
import { SeverityDistributionBar } from "~/components/dashboard/serverity-distribution-bar";
import { RecentIncidentCard } from "~/components/dashboard/recent-incident-card";
import { AskPanel } from "~/components/chat/ask-panel";
import { Skeleton } from "~/components/ui/skeleton";

const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3"];

export default function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId: rawProjectId } = use(params);
  const projectId = rawProjectId as Id<"projects">;
  const [range, setRange] = useState<TimeRange>("daily");

  const project = useQuery(api.projects.get, { projectId });
  const incidents = useQuery(api.incidents.listByProject, { projectId });

  if (project === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050807]">
        <Skeleton className="h-8 w-48 bg-white/5" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-[#050807] text-white/50">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Topbar onRangeChange={setRange} projectId={projectId} projectName={project.name} range={range} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChecksHeroCard projectId={projectId} />
            </div>
            <ActiveAgentsCard projectId={projectId} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <UsageChart projectId={projectId} />
            </div>
            <SuccessRateGauge projectId={projectId} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ActivityHeatmap projectId={projectId} />
            <SeverityDistributionBar projectId={projectId} />
          </div>

          <div className="mt-4">
            <p className="mb-3 text-sm font-medium text-white/70">Recent Incidents</p>
            {incidents === undefined ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {skeletonIds.map((id) => (
                  <Skeleton className="h-24 w-full rounded-xl bg-white/5" key={id} />
                ))}
              </div>
            ) : incidents.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-white/30">
                No incidents yet — {project.name} is healthy.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {incidents.slice(0, 3).map((incident) => (
                  <RecentIncidentCard incident={incident} key={incident._id} projectId={projectId} />
                ))}
              </div>
            )}
          </div>
        </div>

        <AskPanel projectId={projectId} />
      </div>
    </div>
  );
}