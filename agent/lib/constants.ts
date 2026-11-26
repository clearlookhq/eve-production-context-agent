export const SLACK_CONNECTOR = process.env.SLACK_CONNECTOR ?? "slack/sre";
export const GITHUB_CONNECTOR = process.env.GITHUB_CONNECTOR ?? "github/sre";
export const SRE_VERCEL_CONNECTOR =
  process.env.SRE_VERCEL_CONNECTOR ?? "vercel/sre";

/** Clearlook: app.clearlook.dev, or your own server. */
export const CLEARLOOK_URL = (
  process.env.CLEARLOOK_URL ?? "https://app.clearlook.dev"
).replace(/\/$/u, "");
/**
 * A Clearlook service key with only "Ask questions (query)" (Settings › API keys). Set it for webhook and
 * channel-watch runs, which have no person to sign in. Without it, the agent signs in through
 * Vercel Connect (CLEARLOOK_CONNECTOR), which works only in sessions a Slack user starts.
 */
export const CLEARLOOK_API_KEY = process.env.CLEARLOOK_API_KEY ?? "";
export const CLEARLOOK_CONNECTOR =
  process.env.CLEARLOOK_CONNECTOR ?? "clearlook/sre";
/** The Clearlook project to investigate when a request doesn't name one (slug, name or id). */
export const CLEARLOOK_PROJECT = process.env.CLEARLOOK_PROJECT ?? "";
