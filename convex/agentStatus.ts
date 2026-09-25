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
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("agentStatus")
      .withIndex("by_project_agent", (q) => q.eq("projectId", args.projectId))
      .collect();
    const byAgent = new Map(rows.map((r) => [r.agent, r]));
    return AGENTS.map(
      (agent) =>
        byAgent.get(agent) ?? { agent, status: "idle" as const, todayCount: 0, lastRunAt: undefined }
    );
  },
});

async function findRow(ctx: any, projectId: any, agent: string) {
  return ctx.db
    .query("agentStatus")
    .withIndex("by_project_agent", (q: any) => q.eq("projectId", projectId).eq("agent", agent))
    .unique();
}

export const setRunning = internalMutation({
  args: { projectId: v.id("projects"), agent: AGENT },
  handler: async (ctx, args) => {
    const existing = await findRow(ctx, args.projectId, args.agent);
    if (existing) {
      await ctx.db.patch(existing._id, { status: "running", lastRunAt: Date.now() });
    } else {
      await ctx.db.insert("agentStatus", {
        projectId: args.projectId,
        agent: args.agent,
        status: "running",
        todayCount: 0,
        lastRunAt: Date.now(),
      });
    }
  },
});

export const setIdle = internalMutation({
  args: { projectId: v.id("projects"), agent: AGENT, success: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await findRow(ctx, args.projectId, args.agent);
    const status = args.success ? "idle" : "error";
    if (existing) {
      await ctx.db.patch(existing._id, { status, todayCount: existing.todayCount + 1 });
    } else {
      await ctx.db.insert("agentStatus", {
        projectId: args.projectId,
        agent: args.agent,
        status,
        todayCount: 1,
        lastRunAt: Date.now(),
      });
    }
  },
});