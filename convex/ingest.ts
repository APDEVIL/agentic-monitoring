import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const receiveAlert = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  if (!projectId) {
    return new Response("Missing projectId query param, e.g. /alerts?projectId=xxx", { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (Array.isArray(body.alerts)) {
    for (const alert of body.alerts) {
      const labels = alert.labels ?? {};
      await ctx.runMutation(internal.detection.evaluate, {
        projectId: projectId as Id<"projects">,
        source: "push",
        service: labels.service ?? labels.instance ?? "unknown",
        metric: labels.metric ?? "error_rate",
        value: Number(labels.value ?? 1),
      });
    }
    return new Response("ok", { status: 200 });
  }

  if (body.service && body.metric && typeof body.value === "number") {
    await ctx.runMutation(internal.detection.evaluate, {
      projectId: projectId as Id<"projects">,
      source: "push",
      service: body.service,
      metric: body.metric,
      value: body.value,
    });
    return new Response("ok", { status: 200 });
  }

  return new Response("Unrecognized payload shape", { status: 400 });
});