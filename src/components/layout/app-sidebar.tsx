"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import {
  Bot,
  ChevronsUpDown,
  LayoutGrid,
  Plug,
  PlayCircle,
  BarChart3,
  Settings,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

interface AppSidebarProps {
  projectId: Id<"projects">;
}

function buildNavItems(projectId: string) {
  return [
    { label: "Dashboard", href: `/projects/${projectId}`, icon: LayoutGrid },
    { label: "Agents", href: `/projects/${projectId}/agents`, icon: Bot },
    { label: "Runs", href: `/projects/${projectId}/runs`, icon: PlayCircle },
    { label: "Analytics", href: `/projects/${projectId}/analytics`, icon: BarChart3 },
    { label: "Rules", href: `/projects/${projectId}/rules`, icon: SlidersHorizontal },
    { label: "Integrations", href: `/projects/${projectId}/integrations`, icon: Plug },
    { label: "Settings", href: `/projects/${projectId}/settings`, icon: Settings },
  ];
}

export function AppSidebar({ projectId }: AppSidebarProps) {
  const pathname = usePathname();
  const projects = useQuery(api.projects.list);
  const currentProject = projects?.find((p) => p._id === projectId);

  return (
    <Sidebar className="border-white/10 bg-[#0b0f0e]">
      <SidebarHeader className="gap-3 px-3 py-4">
        <div className="flex items-center gap-2 px-1 text-white">
          <Zap className="h-5 w-5 fill-lime-400 text-lime-400" />
          <span className="text-lg font-semibold">Pulse</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="w-full justify-between border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
                variant="outline"
              />
            }
          >
            <span className="truncate">{currentProject?.name ?? "Select project"}</span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {projects?.map((project) => (
              <DropdownMenuItem key={project._id} render={<Link href={`/projects/${project._id}`} />}>
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem render={<Link className="text-lime-400" href="/projects" />}>
              + New project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {buildNavItems(projectId).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      className={isActive ? "bg-lime-400/10 text-lime-300" : "text-white/60"}
                      isActive={isActive}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">Go PRO</p>
          <p className="mt-1 text-xs text-white/50">Unlimited projects & priority compute for your team.</p>
          <Button className="mt-3 w-full bg-lime-400 text-black hover:bg-lime-300" size="sm">
            Upgrade now
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}