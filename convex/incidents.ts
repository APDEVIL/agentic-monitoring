import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getById = internalQuery({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => await ctx.db.get(args.incidentId),
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("incidents")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(50),
});

export const get = query({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => await ctx.db.get(args.incidentId),
});

export const getSteps = query({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("agentSteps")
      .withIndex("by_incident", (q) => q.eq("incidentId", args.incidentId))
      .order("asc")
      .collect(),
});

export const markResolved = mutation({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.incidentId, { status: "resolved", updatedAt: Date.now() });
  },
});

export const getProjectStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const incidents = await ctx.db
      .query("incidents")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();

    const resolvedCount = incidents.filter((i) => i.status === "resolved").length;

    return {
      totalIncidents: incidents.length,
      todayCount: incidents.filter((i) => i.createdAt >= todayMs).length,
      openCount: incidents.filter((i) => i.status !== "resolved").length,
      criticalCount: incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length,
      resolvedCount,
      successRate: incidents.length === 0 ? 100 : Math.round((resolvedCount / incidents.length) * 100),
    };
  },
});