import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { callGroqJSON } from "./lib/groq";

interface ResolutionResult {
  suggestedFix: string;
  riskLevel: "low" | "medium" | "high";
  autoApplicable: boolean;
}

export const saveResolution = internalMutation({
  args: { incidentId: v.id("incidents"), result: v.any() },
  handler: async (ctx, args) => {
    const r = args.result as ResolutionResult;
    await ctx.db.patch(args.incidentId, {
      suggestedFix: `${r.suggestedFix} (risk: ${r.riskLevel})`,
      status: "resolution_proposed",
      updatedAt: Date.now(),
    });
    await ctx.db.insert("agentSteps", {
      incidentId: args.incidentId,
      agent: "resolution",
      output: JSON.stringify(r),
      createdAt: Date.now(),
    });
  },
});

export const propose = internalAction({
  args: { incidentId: v.id("incidents"), projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.agentStatus.setRunning, { projectId: args.projectId, agent: "resolution" });
    try {
      const incident = await ctx.runQuery(internal.incidents.getById, { incidentId: args.incidentId });
      if (!incident) {
        await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "resolution", success: false });
        return;
      }

      const result = await callGroqJSON<ResolutionResult>([
        { role: "system", content: "You are a DevOps resolution agent. Given an incident and its diagnosis, respond ONLY with JSON: " + '{"suggestedFix": string, "riskLevel": "low"|"medium"|"high", "autoApplicable": boolean}. No prose, no markdown.' },
        { role: "user", content: `Incident: service=${incident.service}, metric=${incident.metric}, value=${incident.value}. Diagnosis: ${incident.diagnosis}.` },
      ]);

      await ctx.runMutation(internal.resolution.saveResolution, { incidentId: args.incidentId, result });
      await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "resolution", success: true });
      await ctx.scheduler.runAfter(0, internal.notify.send, { incidentId: args.incidentId, projectId: args.projectId });
    } catch (err) {
      await ctx.runMutation(internal.agentStatus.setIdle, { projectId: args.projectId, agent: "resolution", success: false });
      throw err;
    }
  },
});

