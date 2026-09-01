"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

export type TimeRange = "daily" | "weekly" | "monthly";

interface TopbarProps {
  projectId: Id<"projects">;
  projectName: string;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function Topbar({ projectId, projectName, range, onRangeChange }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const incidents = useQuery(api.incidents.listByProject, { projectId });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#050807] px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-white">{projectName}</h1>
        <p className="text-xs text-white/40">{today}</p>
      </div>

      <button
        className="flex w-72 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/40 transition-colors hover:border-white/20"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search className="h-4 w-4" />
        Search runs, agents...
        <kbd className="ml-auto rounded border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <Tabs onValueChange={(v) => onRangeChange(v as TimeRange)} value={range}>
        <TabsList className="bg-white/[0.03]">
          <TabsTrigger className="data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="daily">
            Daily
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="weekly">
            Weekly
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="monthly">
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-lime-400/20 text-lime-300">U</AvatarFallback>
      </Avatar>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Search incidents, agents, pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Incidents">
            {incidents?.slice(0, 6).map((incident) => (
              <CommandItem
                key={incident._id}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/projects/${projectId}/runs/${incident._id}`);
                }}
              >
                {incident.service} — {incident.metric}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}