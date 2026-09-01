"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Globe } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface ProjectCardProps {
  project: Doc<"projects">;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stats = useQuery(api.incidents.getProjectStats, { projectId: project._id });
  const displayUrl = project.url.replace(/^https?:\/\//, "");
  const hasCritical = (stats?.criticalCount ?? 0) > 0;

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} layout>
      <Link href={`/projects/${project._id}`}>
        <Card className="group border-white/10 bg-white/[0.03] transition-colors hover:border-lime-400/30">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-white/60">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-white">{project.name}</p>
                <p className="text-xs text-white/40">{displayUrl}</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/20 transition-colors group-hover:text-lime-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-white/50">
                <span>{stats?.openCount ?? 0} open</span>
                <span>{stats?.successRate ?? 100}% success</span>
              </div>
              {hasCritical ? (
                <Badge className="bg-red-500/10 text-red-300" variant="outline">
                  <AlertTriangle className="mr-1 h-3 w-3" /> {stats?.criticalCount} critical
                </Badge>
              ) : (
                <Badge className="bg-lime-400/10 text-lime-300" variant="outline">
                  Healthy
                </Badge>
              )}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/30">
              <span
                className={
                  project.active ? "h-1.5 w-1.5 rounded-full bg-lime-400" : "h-1.5 w-1.5 rounded-full bg-white/20"
                }
              />
              {project.active ? "Monitoring active" : "Paused"}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}