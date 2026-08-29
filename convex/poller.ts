import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const pollAllTargets = internalAction({
  args: {},
  handler: async (ctx) => {
    const targets = await ctx.runQuery(internal.targets.listActive, {});

    for (const target of targets) {
      const start = Date.now();
      let statusCode = 0;
      let reachable = true;

      try {
        const res = await fetch(target.url, { method: "GET" });
        statusCode = res.status;
      } catch {
        reachable = false;
      }

      const latency = Date.now() - start;

      await ctx.runMutation(internal.detection.evaluate, {
        source: "poll",
        targetId: target._id,
        service: target.name,
        metric: "latency_ms",
        value: latency,
      });

      await ctx.runMutation(internal.detection.evaluate, {
        source: "poll",
        targetId: target._id,
        service: target.name,
        metric: "status_code",
        value: reachable ? statusCode : 503,
      });

      await ctx.runMutation(internal.targets.markChecked, { targetId: target._id });
    }
  },
});