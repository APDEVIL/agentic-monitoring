import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    url: v.string(),
    intervalSeconds: v.number(),
    active: v.boolean(),
    lastCheckedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_active", ["active"]),

  incidents: defineTable({
    projectId: v.id("projects"),
    source: v.union(v.literal("poll"), v.literal("push")),
    service: v.string(),
    metric: v.string(),
    value: v.number(),
    threshold: v.number(),
    severity: v.union(v.literal("warning"), v.literal("critical")),
    status: v.union(
      v.literal("detected"),
      v.literal("diagnosing"),
      v.literal("diagnosed"),
      v.literal("resolution_proposed"),
      v.literal("notified"),
      v.literal("resolved")
    ),
    diagnosis: v.optional(v.string()),
    suggestedFix: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_status", ["projectId", "status"])
    .index("by_createdAt", ["createdAt"]),

  agentSteps: defineTable({
    incidentId: v.id("incidents"),
    agent: v.union(
      v.literal("detection"),
      v.literal("diagnosis"),
      v.literal("resolution"),
      v.literal("notification")
    ),
    output: v.string(),
    createdAt: v.number(),
  }).index("by_incident", ["incidentId"]),

  agentStatus: defineTable({
    agent: v.union(
      v.literal("detection"),
      v.literal("diagnosis"),
      v.literal("resolution"),
      v.literal("notification")
    ),
    status: v.union(v.literal("idle"), v.literal("running"), v.literal("error")),
    todayCount: v.number(),
    lastRunAt: v.optional(v.number()),
  }).index("by_agent", ["agent"]),

  chatMessages: defineTable({
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]),
});