import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { evaluateReading } from "./lib/rules";
import { internal } from "./_generated/api";

export const evaluate = internalMutation({
  args: {
    source: v.union(v.literal("poll"), v.literal("push")),
    targetId: v.optional(v.id("targets")),
    service: v.string(),
    metric: v.union(
      v.literal("error_rate"),
      v.literal("latency_ms"),
      v.literal("status_code"),
      v.literal("cpu_percent"),
      v.literal("memory_percent")
    ),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const rule = evaluateReading({ metric: args.metric, value: args.value, service: args.service });
    if (!rule) return null; // no breach — nothing to do

    const now = Date.now();
    const incidentId = await ctx.db.insert("incidents", {
      source: args.source,
      targetId: args.targetId,
      service: args.service,
      metric: args.metric,
      value: args.value,
      threshold: rule.threshold,
      severity: rule.severity,
      status: "detected",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("agentSteps", {
      incidentId,
      agent: "detection",
      output: `${args.metric} = ${args.value} breached ${rule.operator} ${rule.threshold} (${rule.severity})`,
      createdAt: now,
    });

    // hand off to the next agent in the pipeline
    await ctx.scheduler.runAfter(0, internal.diagnosis.analyze, { incidentId });

    return incidentId;
  },
});