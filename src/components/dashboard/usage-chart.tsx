"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface UsageChartProps {
  projectId: Id<"projects">;
}

type Metric = "tokens" | "cost" | "latency";

const TOKENS_PER_LLM_CALL = 650;
const COST_PER_1K_TOKENS = 0.0002;

export function UsageChart({ projectId }: UsageChartProps) {
  const [metric, setMetric] = useState<Metric>("tokens");
  const incidents = useQuery(api.incidents.listByProject, { projectId });

  const data = useMemo(() => {
    if (!incidents) return [];
    const buckets = new Map<string, { day: string; llmCalls: number; latencySum: number; latencyCount: number }>();

    for (const incident of incidents) {
      const day = new Date(incident.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const bucket = buckets.get(day) ?? { day, llmCalls: 0, latencySum: 0, latencyCount: 0 };
      if (incident.diagnosis) bucket.llmCalls += 1;
      if (incident.suggestedFix) bucket.llmCalls += 1;
      if (incident.metric === "latency_ms") {
        bucket.latencySum += incident.value;
        bucket.latencyCount += 1;
      }
      buckets.set(day, bucket);
    }

    return Array.from(buckets.values())
      .reverse()
      .map((b) => ({
        day: b.day,
        tokens: b.llmCalls * TOKENS_PER_LLM_CALL,
        cost: Number((((b.llmCalls * TOKENS_PER_LLM_CALL) / 1000) * COST_PER_1K_TOKENS).toFixed(4)),
        latency: b.latencyCount > 0 ? Math.round(b.latencySum / b.latencyCount) : 0,
      }));
  }, [incidents]);

  const suffix = metric === "cost" ? "$" : metric === "latency" ? "ms" : "";

  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-sm font-medium text-white/70">Groq usage — {metric}</p>
        <Tabs onValueChange={(v) => setMetric(v as Metric)} value={metric}>
          <TabsList className="h-8 bg-white/[0.05]">
            <TabsTrigger className="text-xs data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="tokens">
              Tokens
            </TabsTrigger>
            <TabsTrigger className="text-xs data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="cost">
              Cost
            </TabsTrigger>
            <TabsTrigger className="text-xs data-[state=active]:bg-lime-400 data-[state=active]:text-black" value="latency">
              Latency
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={160} width="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="usageGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" fontSize={10} stroke="#ffffff30" />
            <Tooltip
              contentStyle={{ background: "#0b0f0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              formatter={(value) => [`${value ?? 0}${suffix}`, metric]}
            />
            <Area dataKey={metric} fill="url(#usageGradient)" stroke="#a3e635" strokeWidth={2} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-[11px] text-white/30">
          Estimated from LLM calls per incident — swap in Groq's real usage API for exact figures.
        </p>
      </CardContent>
    </Card>
  );
}