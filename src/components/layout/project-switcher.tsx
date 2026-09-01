"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ProjectSwitcherProps {
  activeProjectId: Id<"projects">;
}

export function ProjectSwitcher({ activeProjectId }: ProjectSwitcherProps) {
  const projects = useQuery(api.projects.list);
  const activeProject = projects?.find((p) => p._id === activeProjectId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="w-full justify-between border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
            variant="outline"
          />
        }
      >
        <span className="truncate">{activeProject?.name ?? "Select project"}</span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {projects === undefined ? (
          <DropdownMenuItem disabled>Loading projects...</DropdownMenuItem>
        ) : projects.length === 0 ? (
          <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
        ) : (
          projects.map((project) => (
            <DropdownMenuItem key={project._id} render={<Link href={`/projects/${project._id}`} />}>
              <span className="truncate">{project.name}</span>
              {project._id === activeProjectId ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-400" />
              ) : null}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link className="text-lime-400" href="/projects" />}>
          <Plus className="mr-2 h-4 w-4" /> New project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}