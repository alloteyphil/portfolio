import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());

const envSchema = z.object({
  GITHUB_TOKEN: optionalString,
  GITHUB_USERNAME: optionalString,
  SCREENSHOTONE_API_KEY: optionalString,
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  REFRESH_SCREENSHOTS_SECRET: optionalString,
  VERCEL_DEPLOY_HOOK_URL: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  RESEND_API_KEY: optionalString,
  CONTACT_FROM_EMAIL: optionalEmail,
  CONTACT_TO_EMAIL: optionalEmail,
  VERCEL_ANALYTICS_TOKEN: optionalString,
  DILLI_VERCEL_PROJECT_ID: optionalString,
  DILLI_VERCEL_TEAM_ID: optionalString,
  PORTFOLIO_CONFIG_REPO: optionalString,
  PORTFOLIO_CONFIG_REPO_NAME: optionalString
});

export const env = envSchema.parse(process.env);

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
