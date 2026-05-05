import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z.object({
  GITHUB_TOKEN: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  GITHUB_USERNAME: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SCREENSHOTONE_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CLOUDINARY_CLOUD_NAME: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CLOUDINARY_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CLOUDINARY_API_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  REFRESH_SCREENSHOTS_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  VERCEL_DEPLOY_HOOK_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  TURNSTILE_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CONTACT_FROM_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  CONTACT_TO_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  ADMIN_OWNER_EMAILS: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  PORTFOLIO_CONFIG_REPO: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  PORTFOLIO_CONFIG_REPO_NAME: z.preprocess(emptyToUndefined, z.string().min(1).optional())
});

const parsed = envSchema.parse(process.env);

export const env = parsed;
