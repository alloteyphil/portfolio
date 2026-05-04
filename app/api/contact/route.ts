import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { getPostHogClient } from "@/lib/posthog-server";

const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(4000),
  turnstileToken: z.string().trim().min(1, "Turnstile verification is required.")
});

type TurnstileVerifyResponse = {
  success: boolean;
};

async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    return false;
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token
    })
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as TurnstileVerifyResponse;
  return payload.success;
}

async function sendContactEmail(input: z.infer<typeof contactPayloadSchema>): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: input.email,
      subject: `[Portfolio Contact] ${input.subject}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`
    })
  });

  return response.ok;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = contactPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid contact payload." }, { status: 400 });
  }

  const turnstileValid = await verifyTurnstileToken(parsed.data.turnstileToken);
  if (!turnstileValid) {
    return NextResponse.json({ ok: false, error: "Turnstile validation failed." }, { status: 400 });
  }

  const emailSent = await sendContactEmail(parsed.data);
  if (!emailSent) {
    return NextResponse.json({ ok: false, error: "Contact delivery failed." }, { status: 502 });
  }

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: parsed.data.email,
    event: "contact_message_received",
    properties: {
      subject: parsed.data.subject,
      name: parsed.data.name
    }
  });

  return NextResponse.json({ ok: true });
}
