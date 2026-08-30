import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

const AGENT = v.union(
  v.literal("detection"),
  v.literal("diagnosis"),
  v.literal("resolution"),
  v.literal("notification")
);

const AGENTS = ["detection", "diagnosis", "resolution", "notification"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("agentStatus").collect();
    const byAgent = new Map(rows.map((r) => [r.agent, r]));
    return AGENTS.map(
      (agent) =>
        byAgent.get(agent) ?? { agent, status: "idle" as const, todayCount: 0, lastRunAt: undefined }
    );
  },
});

export const setRunning = internalMutation({
  args: { agent: AGENT },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentStatus")
      .withIndex("by_agent", (q) => q.eq("agent", args.agent))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { status: "running", lastRunAt: Date.now() });
    } else {
      await ctx.db.insert("agentStatus", { agent: args.agent, status: "running", todayCount: 0, lastRunAt: Date.now() });
    }
  },
});

export const setIdle = internalMutation({
  args: { agent: AGENT, success: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentStatus")
      .withIndex("by_agent", (q) => q.eq("agent", args.agent))
      .unique();
    const status = args.success ? "idle" : "error";
    if (existing) {
      await ctx.db.patch(existing._id, { status, todayCount: existing.todayCount + 1 });
    } else {
      await ctx.db.insert("agentStatus", { agent: args.agent, status, todayCount: 1, lastRunAt: Date.now() });
    }
  },
});