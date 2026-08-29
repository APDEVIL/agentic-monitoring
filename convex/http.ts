import { httpRouter } from "convex/server";
import { receiveAlert } from "./ingest";

const http = httpRouter();
http.route({ path: "/alerts", method: "POST", handler: receiveAlert });
export default http;