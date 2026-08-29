import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL. Run `bunx convex dev` once to generate it in .env.local, then restart `bun dev`."
  );
}

export const convexClient = new ConvexReactClient(convexUrl);