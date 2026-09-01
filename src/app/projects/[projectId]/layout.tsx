import type { ReactNode } from "react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectId: string };
}) {
  return (
    <SidebarProvider>
      <AppSidebar projectId={params.projectId as Id<"projects">} />
      <SidebarInset className="bg-[#050807]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 md:hidden">
          <SidebarTrigger className="text-white" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}