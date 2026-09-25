import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const record = internalMutation({
  args: {
    projectId: v.id("projects"),
    service: v.string(),
    statusCode: v.number(),
    latencyMs: v.number(),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("checks", { ...args, checkedAt: Date.now() });
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("checks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(50),
});