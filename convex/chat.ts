import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";
import { callGroq } from "./lib/groq";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("chatMessages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect(),
});

export const saveMessage = internalMutation({
  args: {
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", { ...args, createdAt: Date.now() });
  },
});

export const sendQuestion = mutation({
  args: { projectId: v.id("projects"), question: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: args.question,
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.chat.ask, args);
  },
});

export const ask = internalAction({
  args: { projectId: v.id("projects"), question: v.string() },
  handler: async (ctx, args) => {
    try {
      const project = await ctx.runQuery(api.projects.get, { projectId: args.projectId });
      const incidents = await ctx.runQuery(api.incidents.listByProject, { projectId: args.projectId });
      const recent = incidents.slice(0, 10);

      const context = recent
        .map(
          (i) =>
            `- [${i.severity}] ${i.service} / ${i.metric}=${i.value} (status: ${i.status})` +
            `${i.diagnosis ? `, diagnosis: ${i.diagnosis}` : ""}${i.suggestedFix ? `, fix: ${i.suggestedFix}` : ""}`
        )
        .join("\n");

      const answer = await callGroq([
        {
          role: "system",
          content:
            `You are Pulse, an AI assistant for a DevOps monitoring dashboard. ` +
            `You are answering questions about the project "${project?.name}" (${project?.url}). ` +
            `Use the incident data below to answer concisely and specifically. If it doesn't cover the question, say so.\n\n` +
            `Recent incidents:\n${context || "No incidents recorded yet."}`,
        },
        { role: "user", content: args.question },
      ]);

      await ctx.runMutation(internal.chat.saveMessage, {
        projectId: args.projectId,
        role: "assistant",
        content: answer,
      });
    } catch (err) {
      console.error("chat.ask failed:", err);
      await ctx.runMutation(internal.chat.saveMessage, {
        projectId: args.projectId,
        role: "assistant",
        content: "Sorry, I couldn't process that — check the Convex logs for chat:ask to see what went wrong.",
      });
    }
  },
});