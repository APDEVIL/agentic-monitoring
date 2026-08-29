import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getById = internalQuery({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => await ctx.db.get(args.incidentId),
});

export const list = query({
  args: {},
  handler: async (ctx) =>
    await ctx.db.query("incidents").withIndex("by_createdAt").order("desc").take(50),
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

// human clicks "Resolve" on the dashboard after reviewing the suggested fix
export const markResolved = mutation({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.incidentId, { status: "resolved", updatedAt: Date.now() });
  },
});