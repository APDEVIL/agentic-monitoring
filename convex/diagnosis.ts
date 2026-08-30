import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { callGroqJSON } from "./lib/groq";

interface DiagnosisResult {
  rootCause: string;
  confidence: "low" | "medium" | "high";
  affectedComponent: string;
}

export const saveDiagnosis = internalMutation({
  args: { incidentId: v.id("incidents"), result: v.any() },
  handler: async (ctx, args) => {
    const r = args.result as DiagnosisResult;
    await ctx.db.patch(args.incidentId, {
      diagnosis: `${r.rootCause} (confidence: ${r.confidence}, component: ${r.affectedComponent})`,
      status: "diagnosed",
      updatedAt: Date.now(),
    });
    await ctx.db.insert("agentSteps", {
      incidentId: args.incidentId,
      agent: "diagnosis",
      output: JSON.stringify(r),
      createdAt: Date.now(),
    });
  },
});

export const analyze = internalAction({
  args: { incidentId: v.id("incidents") },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.agentStatus.setRunning, { agent: "diagnosis" });
    try {
      const incident = await ctx.runQuery(internal.incidents.getById, { incidentId: args.incidentId });
      if (!incident) {
        await ctx.runMutation(internal.agentStatus.setIdle, { agent: "diagnosis", success: false });
        return;
      }

      const result = await callGroqJSON<DiagnosisResult>([
        {
          role: "system",
          content:
            "You are a DevOps root-cause analysis agent. Given an incident, respond ONLY with JSON: " +
            '{"rootCause": string, "confidence": "low"|"medium"|"high", "affectedComponent": string}. No prose, no markdown.',
        },
        {
          role: "user",
          content: `Incident: service=${incident.service}, metric=${incident.metric}, value=${incident.value}, threshold=${incident.threshold}, severity=${incident.severity}.`,
        },
      ]);

      await ctx.runMutation(internal.diagnosis.saveDiagnosis, { incidentId: args.incidentId, result });
      await ctx.runMutation(internal.agentStatus.setIdle, { agent: "diagnosis", success: true });
      await ctx.scheduler.runAfter(0, internal.resolution.propose, { incidentId: args.incidentId });
    } catch (err) {
      await ctx.runMutation(internal.agentStatus.setIdle, { agent: "diagnosis", success: false });
      throw err;
    }
  },
});