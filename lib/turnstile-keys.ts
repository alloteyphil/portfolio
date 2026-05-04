/**
 * Cloudflare Turnstile [dummy keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
 * for local dev: they work on any host (including localhost) without hostname allowlisting.
 * Production secret rejects dummy tokens — dev must use the dummy secret below when the widget uses the dummy site key.
 */
export const TURNSTILE_DUMMY_SITE_KEY_VISIBLE_PASS = "1x00000000000000000000AA";
export const TURNSTILE_DUMMY_SECRET_ALWAYS_PASS = "1x0000000000000000000000000000000AA";

/** Opt in to real keys while running `next dev` (after adding hosts in the Turnstile dashboard). */
const FORCE_PRODUCTION_TURNSTILE =
  process.env.NEXT_PUBLIC_TURNSTILE_USE_PRODUCTION_KEYS === "true";

export function getTurnstileClientSiteKey(): string | undefined {
  if (FORCE_PRODUCTION_TURNSTILE) {
    return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  }
  if (process.env.NODE_ENV === "development") {
    return TURNSTILE_DUMMY_SITE_KEY_VISIBLE_PASS;
  }
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

export function getTurnstileServerSecret(productionSecret: string | undefined): string | undefined {
  if (FORCE_PRODUCTION_TURNSTILE) {
    return productionSecret;
  }
  if (process.env.NODE_ENV === "development") {
    return TURNSTILE_DUMMY_SECRET_ALWAYS_PASS;
  }
  return productionSecret;
}
