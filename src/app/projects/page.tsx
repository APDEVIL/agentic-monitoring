"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Radar, Zap } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { CreateProjectDialog } from "~/components/projects/create-project-dialog";
import { ProjectCard } from "~/components/projects/project-card";
import { Skeleton } from "~/components/ui/skeleton";

const skeletonIds = ["skeleton-1", "skeleton-2", "skeleton-3"];

export default function ProjectsPage() {
  const projects = useQuery(api.projects.list);

  return (
    <div className="min-h-screen bg-[#050807] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 fill-lime-400 text-lime-400" />
          <span className="text-lg font-semibold">Pulse</span>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <p className="mt-1 text-sm text-white/50">Monitor any website or service — pick one to see its live report.</p>
          </div>
          {projects && projects.length > 0 ? <CreateProjectDialog /> : null}
        </div>

        {projects === undefined ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skeletonIds.map((id) => (
              <Skeleton className="h-32 w-full rounded-xl bg-white/5" key={id} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 py-20 text-center"
            initial={{ opacity: 0, y: 12 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-300">
              <Radar className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-white">No projects yet</p>
              <p className="mt-1 max-w-sm text-sm text-white/40">
                Add a website URL — your own, or something like youtube.com to try it out — and Pulse starts checking it right away.
              </p>
            </div>
            <CreateProjectDialog />
          </motion.div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}