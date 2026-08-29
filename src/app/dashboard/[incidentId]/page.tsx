"use client";

import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AgentTrace } from "~/components/dashboard/agent-trace";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function IncidentDetailPage() {
  const params = useParams<{ incidentId: string }>();
  const router = useRouter();
  const incidentId = params.incidentId as Id<"incidents">;

  const incident = useQuery(api.incidents.get, { incidentId });
  const markResolved = useMutation(api.incidents.markResolved);

  async function handleResolve() {
    try {
      await markResolved({ incidentId });
      toast.success("Incident marked as resolved");
    } catch {
      toast.error("Failed to update incident");
    }
  }

  if (incident === undefined) {
    return (
      <div className="min-h-screen space-y-4 bg-[#050807] px-6 py-10 sm:px-10">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <Skeleton className="h-40 w-full max-w-2xl bg-white/5" />
      </div>
    );
  }

  if (incident === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050807] text-white/60">
        <p>Incident not found.</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050807] px-6 py-10 sm:px-10">
      <motion.div animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl" initial={{ opacity: 0, y: 12 }}>
        <Link className="flex items-center gap-2 text-sm text-white/50 hover:text-white" href="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">{incident.service}</h1>
          <Badge
            className={
              incident.severity === "critical"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
            }
            variant="outline"
          >
            {incident.severity}
          </Badge>
        </div>

        <Card className="mt-6 border-white/10 bg-white/[0.03]">
          <CardContent className="grid grid-cols-2 gap-4 pt-6 text-sm sm:grid-cols-4">
            <div>
              <p className="text-white/40">Metric</p>
              <p className="mt-1 text-white">{incident.metric}</p>
            </div>
            <div>
              <p className="text-white/40">Value</p>
              <p className="mt-1 text-white">{incident.value}</p>
            </div>
            <div>
              <p className="text-white/40">Threshold</p>
              <p className="mt-1 text-white">{incident.threshold}</p>
            </div>
            <div>
              <p className="text-white/40">Status</p>
              <p className="mt-1 capitalize text-emerald-300">{incident.status.replace("_", " ")}</p>
            </div>
          </CardContent>
        </Card>

        {incident.diagnosis ? (
          <Card className="mt-4 border-white/10 bg-white/[0.03]">
            <CardContent className="pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-white/40">Root Cause</p>
              <p className="mt-2 text-sm text-white/80">{incident.diagnosis}</p>
            </CardContent>
          </Card>
        ) : null}

        {incident.suggestedFix ? (
          <Card className="mt-4 border-white/10 bg-white/[0.03]">
            <CardContent className="pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-white/40">Suggested Fix</p>
              <p className="mt-2 text-sm text-white/80">{incident.suggestedFix}</p>
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-white/70">Agent Trace</p>
          <AgentTrace incidentId={incidentId} />
        </div>

        {incident.status !== "resolved" ? (
          <Button className="mt-8 bg-emerald-400 text-black hover:bg-emerald-300" onClick={handleResolve}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
          </Button>
        ) : (
          <div className="mt-8 flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> This incident has been resolved.
          </div>
        )}
      </motion.div>
    </div>
  );
}