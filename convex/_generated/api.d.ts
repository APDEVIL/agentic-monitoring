/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentStatus from "../agentStatus.js";
import type * as chat from "../chat.js";
import type * as checks from "../checks.js";
import type * as crons from "../crons.js";
import type * as detection from "../detection.js";
import type * as diagnosis from "../diagnosis.js";
import type * as http from "../http.js";
import type * as incidents from "../incidents.js";
import type * as ingest from "../ingest.js";
import type * as lib_groq from "../lib/groq.js";
import type * as lib_rules from "../lib/rules.js";
import type * as notify from "../notify.js";
import type * as poller from "../poller.js";
import type * as projects from "../projects.js";
import type * as resolution from "../resolution.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentStatus: typeof agentStatus;
  chat: typeof chat;
  checks: typeof checks;
  crons: typeof crons;
  detection: typeof detection;
  diagnosis: typeof diagnosis;
  http: typeof http;
  incidents: typeof incidents;
  ingest: typeof ingest;
  "lib/groq": typeof lib_groq;
  "lib/rules": typeof lib_rules;
  notify: typeof notify;
  poller: typeof poller;
  projects: typeof projects;
  resolution: typeof resolution;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
