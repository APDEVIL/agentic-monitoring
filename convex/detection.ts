import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { evaluateReading } from "./lib/rules";
import { internal } from "./_generated/api";

export const evaluate = internalMutation({
  args: {
    projectId: v.id("projects"),
    source: v.union(v.literal("poll"), v.literal("push")),
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
    const statusRow = await ctx.db
      .query("agentStatus")
      .withIndex("by_project_agent", (q) => q.eq("projectId", args.projectId).eq("agent", "detection"))
      .unique();
    if (statusRow) {
      await ctx.db.patch(statusRow._id, { todayCount: statusRow.todayCount + 1, lastRunAt: Date.now(), status: "idle" });
    } else {
      await ctx.db.insert("agentStatus", {
        projectId: args.projectId,
        agent: "detection",
        status: "idle",
        todayCount: 1,
        lastRunAt: Date.now(),
      });
    }

    const rule = evaluateReading({ metric: args.metric, value: args.value, service: args.service });
    if (!rule) return null;

    const now = Date.now();
    const incidentId = await ctx.db.insert("incidents", {
      projectId: args.projectId,
      source: args.source,
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

    await ctx.scheduler.runAfter(0, internal.diagnosis.analyze, { incidentId, projectId: args.projectId });

    return incidentId;
  },
});