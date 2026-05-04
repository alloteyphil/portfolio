"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { z } from "zod";
import posthog from "posthog-js";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string | null;
};

type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
};

type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters.").max(120, "Subject is too long."),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(4000, "Message is too long."),
  turnstileToken: z.string().trim().min(1, "Complete the Turnstile challenge.")
});

export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle", message: null });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileEnabled = useMemo(() => Boolean(turnstileSiteKey), [turnstileSiteKey]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function labelWithRequired(text: string) {
    return (
      <>
        {text} <span className="text-red-400">*</span>
      </>
    );
  }

  function renderFieldError(fieldName: keyof ContactFields) {
    const message = fieldErrors[fieldName];
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-400">{message}</p>;
  }

  function clearFieldError(fieldName: keyof ContactFields) {
    setFieldErrors((previous) => {
      if (!previous[fieldName]) return previous;
      const next = { ...previous };
      delete next[fieldName];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values: ContactFields = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      turnstileToken: String(formData.get("cf-turnstile-response") ?? "")
    };

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      const errorFields: string[] = [];
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          nextErrors[key as keyof ContactFields] = issue.message;
          errorFields.push(key);
        }
      }
      setFieldErrors(nextErrors);
      setToast({ type: "error", message: "Please fix the highlighted fields." });
      posthog.capture("contact_form_validation_failed", { error_fields: errorFields });
      return;
    }

    setFieldErrors({});
    setState({ status: "submitting", message: null });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
          turnstileToken: parsed.data.turnstileToken
        })
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        const errorMessage = payload.error ?? "Unable to send message right now. Please try again.";
        setToast({ type: "error", message: errorMessage });
        setState({ status: "error", message: errorMessage });
        posthog.capture("contact_form_failed", { error: errorMessage, status_code: response.status });
        return;
      }

      form.reset();
      setToast({ type: "success", message: "Message sent successfully." });
      setState({ status: "success", message: "Message sent. Thanks for reaching out." });
      posthog.capture("contact_form_submitted");
    } catch (err) {
      const errorMessage = "Network error while sending message. Please try again.";
      setToast({ type: "error", message: errorMessage });
      setState({ status: "error", message: errorMessage });
      posthog.capture("contact_form_failed", { error: errorMessage });
      posthog.captureException(err);
    }
  }

  return (
    <>
      {toast ? (
        <div
          className={`fixed right-5 top-5 z-50 rounded border px-4 py-3 text-sm shadow-lg ${
            toast.type === "error"
              ? "border-red-400 bg-black text-red-300"
              : "border-terminal-accent bg-black text-terminal-accent"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
      {turnstileEnabled ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Name")}
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={100}
            className={`w-full rounded border bg-transparent px-3 py-2 text-sm outline-none focus:border-terminal-accent ${
              fieldErrors.name ? "border-red-400" : "border-terminal-border"
            }`}
            onChange={() => clearFieldError("name")}
          />
          {renderFieldError("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Email")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={320}
            className={`w-full rounded border bg-transparent px-3 py-2 text-sm outline-none focus:border-terminal-accent ${
              fieldErrors.email ? "border-red-400" : "border-terminal-border"
            }`}
            onChange={() => clearFieldError("email")}
          />
          {renderFieldError("email")}
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Subject")}
          </label>
          <input
            id="contact-subject"
            name="subject"
            required
            maxLength={120}
            className={`w-full rounded border bg-transparent px-3 py-2 text-sm outline-none focus:border-terminal-accent ${
              fieldErrors.subject ? "border-red-400" : "border-terminal-border"
            }`}
            onChange={() => clearFieldError("subject")}
          />
          {renderFieldError("subject")}
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Message")}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            className={`w-full rounded border bg-transparent px-3 py-2 text-sm outline-none focus:border-terminal-accent ${
              fieldErrors.message ? "border-red-400" : "border-terminal-border"
            }`}
            onChange={() => clearFieldError("message")}
          />
          {renderFieldError("message")}
        </div>

        {turnstileEnabled ? (
          <div>
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
            {renderFieldError("turnstileToken")}
          </div>
        ) : (
          <p className="text-xs text-terminal-amber">Turnstile is not configured in this environment.</p>
        )}

        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="inline-flex items-center gap-2 rounded border border-terminal-accent px-4 py-2 text-sm text-terminal-accent disabled:opacity-60"
        >
          {state.status === "submitting" ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-terminal-accent border-t-transparent" />
              sending...
            </>
          ) : (
            "send message"
          )}
        </button>

        {state.message ? (
          <p className={state.status === "error" ? "text-sm text-red-400" : "text-sm text-terminal-text/85"}>
            {state.message}
          </p>
        ) : null}
      </form>
    </>
  );
}
