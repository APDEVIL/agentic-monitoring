import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getIncident = internalQuery({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => await ctx.db.get(args.incidentId),
});

export const markNotified = internalMutation({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.incidentId, { status: "notified", updatedAt: Date.now() });
    await ctx.db.insert("agentSteps", {
      incidentId: args.incidentId,
      agent: "notification",
      output: "Notification sent",
      createdAt: Date.now(),
    });
  },
});

export const send = internalAction({
  args: { incidentId: v.id("incidents"), projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.agentStatus.setRunning, { projectId: args.projectId, agent: "notification" });
    try {
      const incident = await ctx.runQuery(internal.notify.getIncident, { incidentId: args.incidentId });
      if (!incident) {
        await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "notification", success: false });
        return;
      }

      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      const text = `*[${incident.severity.toUpperCase()}] ${incident.service} - ${incident.metric}*\nValue: ${incident.value} (threshold: ${incident.threshold})\nDiagnosis: ${incident.diagnosis ?? "n/a"}\nSuggested fix: ${incident.suggestedFix ?? "n/a"}`;

      if (webhookUrl) {
        await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      }

      await ctx.runMutation(internal.notify.markNotified, { incidentId: args.incidentId });
      await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "notification", success: true });
    } catch (err) {
      await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "notification", success: false });
      throw err;
    }
  },
});