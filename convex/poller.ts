import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const pollAllProjects = internalAction({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.runQuery(internal.projects.listActive, {});

    for (const project of projects) {
      const start = Date.now();
      let statusCode = 0;
      let reachable = true;

      try {
        const res = await fetch(project.url, { method: "GET" });
        statusCode = res.status;
      } catch {
        reachable = false;
      }

      const latency = Date.now() - start;

      await ctx.runMutation(internal.detection.evaluate, {
        projectId: project._id,
        source: "poll",
        service: project.name,
        metric: "latency_ms",
        value: latency,
      });

      await ctx.runMutation(internal.detection.evaluate, {
        projectId: project._id,
        source: "poll",
        service: project.name,
        metric: "status_code",
        value: reachable ? statusCode : 503,
      });

      await ctx.runMutation(internal.projects.markChecked, { projectId: project._id });
    }
  },
});