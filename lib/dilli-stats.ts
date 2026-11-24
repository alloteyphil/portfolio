import { env } from "./env";

/** Figure recorded by hand from the CV (94,600+). Used whenever live data is unavailable, and as a floor. */
const FALLBACK_TOTAL = 94_600;

/** Refresh at most once a day; the numbers only need to be roughly current. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

const COUNT_ENDPOINT = "https://api.vercel.com/v1/query/web-analytics/visits/count";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

export type DilliStats = {
  /** Visitors to dilli-dilli.com to date. Never reported lower than the April 2026 figure. */
  total: number;
  /** Visitors in the last 30 days, or null when Vercel Analytics is not configured or the request failed. */
  last30Days: number | null;
  /** True when the numbers came from Vercel on this render rather than the fallback. */
  live: boolean;
};

const FALLBACK: DilliStats = { total: FALLBACK_TOTAL, last30Days: null, live: false };

/** One call to Vercel's Web Analytics count endpoint; returns the `visitors` figure or null. */
async function countVisitors(params: Record<string, string>): Promise<number | null> {
  const url = new URL(COUNT_ENDPOINT);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${env.VERCEL_ANALYTICS_TOKEN}` },
    next: { revalidate: REVALIDATE_SECONDS }
  });

  if (!response.ok) {
    console.error(`Vercel Web Analytics query failed with HTTP ${response.status}.`);
    return null;
  }

  const payload = (await response.json()) as { data?: { visitors?: unknown } };
  const visitors = Number(payload.data?.visitors);
  return Number.isFinite(visitors) && visitors > 0 ? visitors : null;
}

/**
 * Visitor numbers for dilli-dilli.com from Vercel Web Analytics (the same data as the Vercel dashboard).
 *
 * Needs VERCEL_ANALYTICS_TOKEN (a Vercel access token) and DILLI_VERCEL_PROJECT_ID; add
 * DILLI_VERCEL_TEAM_ID when the project belongs to a team. Without them, or on any error, the
 * homepage shows the April 2026 figure and hides the 30-day line, so analytics can never break the page.
 */
export async function getDilliStats(): Promise<DilliStats> {
  const projectId = env.DILLI_VERCEL_PROJECT_ID;
  if (!env.VERCEL_ANALYTICS_TOKEN || !projectId) return FALLBACK;

  const base: Record<string, string> = { projectId };
  if (env.DILLI_VERCEL_TEAM_ID) base.teamId = env.DILLI_VERCEL_TEAM_ID;

  // Round to the day so the cached request URL stays stable between revalidations.
  // The API rejects `since` without `until`, so the 30-day window always sends both.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const since = new Date(today.getTime() - THIRTY_DAYS_MS).toISOString();
  const until = new Date(today.getTime() + ONE_DAY_MS).toISOString();

  try {
    const [allTime, last30Days] = await Promise.all([
      countVisitors(base),
      countVisitors({ ...base, since, until })
    ]);
    if (allTime === null && last30Days === null) return FALLBACK;

    return {
      // Vercel only counts from the day Web Analytics was enabled, so keep the recorded figure as a floor.
      total: Math.max(allTime ?? 0, FALLBACK_TOTAL),
      last30Days,
      live: true
    };
  } catch (error) {
    console.error("Vercel Web Analytics query failed:", error);
    return FALLBACK;
  }
}
