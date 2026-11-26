import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";
import {
  CLEARLOOK_API_KEY,
  CLEARLOOK_CONNECTOR,
  CLEARLOOK_URL,
} from "#lib/constants.ts";

/**
 * Clearlook's read tools: the investigation engine first, then the evidence it rests on. Changes
 * (goals, monitors, links) are left out; this agent only reads.
 * See https://docs.clearlook.dev/ai/mcp for every tool.
 */
export const CLEARLOOK_MCP_TOOLS = [
  "list_projects",
  "investigate",
  "get_job",
  "compare_release",
  "list_releases",
  "get_overview",
  "get_timeseries",
  "compare_periods",
  "breakdown",
  "get_funnel",
  "list_errors",
  "get_error",
  "get_error_impact",
  "search_logs",
  "get_web_vitals",
  "list_incidents",
  "list_anomalies",
  "list_replays",
  "get_replay_summary",
  "get_tracking_health",
] as const;

export default defineMcpClientConnection({
  // a read-only service key for unattended runs; otherwise sign in through Vercel Connect
  auth: CLEARLOOK_API_KEY
    ? {
        displayName: "Clearlook",
        getToken: () => Promise.resolve({ token: CLEARLOOK_API_KEY }),
        principalType: "app",
      }
    : connect({
        connector: CLEARLOOK_CONNECTOR,
        displayName: "Clearlook",
        principalType: "app",
      }),
  description:
    "Clearlook product context: why a number moved (investigate, with evidence and links), what a release changed, errors and who they hit, server logs, page speed, uptime, and recordings. Read only.",
  tools: {
    allow: [...CLEARLOOK_MCP_TOOLS],
  },
  url: `${CLEARLOOK_URL}/mcp`,
});
