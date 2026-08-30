import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("projects").order("desc").collect(),
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => await ctx.db.get(args.projectId),
});

export const listActive = internalQuery({
  args: {},
  handler: async (ctx) =>
    await ctx.db.query("projects").withIndex("by_active", (q) => q.eq("active", true)).collect(),
});

export const create = mutation({
  args: { name: v.string(), url: v.string(), intervalSeconds: v.optional(v.number()) },
  handler: async (ctx, args) =>
    await ctx.db.insert("projects", {
      name: args.name,
      url: args.url,
      intervalSeconds: args.intervalSeconds ?? 30,
      active: true,
      createdAt: Date.now(),
    }),
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => await ctx.db.delete(args.projectId),
});

export const toggleActive = mutation({
  args: { projectId: v.id("projects"), active: v.boolean() },
  handler: async (ctx, args) => await ctx.db.patch(args.projectId, { active: args.active }),
});

export const markChecked = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => await ctx.db.patch(args.projectId, { lastCheckedAt: Date.now() }),
});