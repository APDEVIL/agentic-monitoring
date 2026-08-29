import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("targets").order("desc").collect(),
});

export const listActive = internalQuery({
  args: {},
  handler: async (ctx) =>
    await ctx.db.query("targets").withIndex("by_active", (q) => q.eq("active", true)).collect(),
});

export const add = mutation({
  args: { name: v.string(), url: v.string(), intervalSeconds: v.optional(v.number()) },
  handler: async (ctx, args) =>
    await ctx.db.insert("targets", {
      name: args.name,
      url: args.url,
      intervalSeconds: args.intervalSeconds ?? 30,
      active: true,
    }),
});

export const remove = mutation({
  args: { targetId: v.id("targets") },
  handler: async (ctx, args) => await ctx.db.delete(args.targetId),
});

export const toggleActive = mutation({
  args: { targetId: v.id("targets"), active: v.boolean() },
  handler: async (ctx, args) => await ctx.db.patch(args.targetId, { active: args.active }),
});

export const markChecked = internalMutation({
  args: { targetId: v.id("targets") },
  handler: async (ctx, args) => await ctx.db.patch(args.targetId, { lastCheckedAt: Date.now() }),
});