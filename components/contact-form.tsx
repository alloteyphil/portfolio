"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { getTurnstileClientSiteKey } from "@/lib/turnstile-keys";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  turnstileToken: ""
};

function getTurnstile(): TurnstileApi | undefined {
  return (globalThis as unknown as { turnstile?: TurnstileApi }).turnstile;
}

function validateContactForm(values: FormValues, turnstileRequired: boolean): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 100) errors.name = "Name is too long.";

  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  else if (email.length > 320) errors.email = "Email is too long.";

  if (subject.length < 2) errors.subject = "Subject must be at least 2 characters.";
  else if (subject.length > 120) errors.subject = "Subject is too long.";

  if (message.length < 10) errors.message = "Message must be at least 10 characters.";
  else if (message.length > 4000) errors.message = "Message is too long.";

  if (turnstileRequired && !values.turnstileToken.trim()) {
    errors.turnstileToken = "Complete the Turnstile challenge.";
  }

  return errors;
}

function fieldClass(hasError: boolean) {
  return `w-full rounded-md border-[1.5px] bg-surface px-4 py-3 text-base text-ink outline-hidden transition placeholder:text-muted/60 focus:border-brand focus:ring-4 focus:ring-accent/60 dark:focus:border-accent dark:focus:ring-accent/25 ${
    hasError ? "border-red-500" : "border-line"
  }`;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const turnstileSiteKey = getTurnstileClientSiteKey();
  const turnstileEnabled = Boolean(turnstileSiteKey);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const updateField = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        if (submittedOnce) {
          setErrors(validateContactForm(next, turnstileEnabled));
        }
        return next;
      });
    },
    [submittedOnce, turnstileEnabled]
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!turnstileEnabled || !turnstileSiteKey) return;
    const siteKey = turnstileSiteKey;
    let disposed = false;

    function removeWidget() {
      const ts = getTurnstile();
      const id = turnstileWidgetIdRef.current;
      if (id && ts) {
        try {
          ts.remove(id);
        } catch {
          /* DOM may already be detached */
        }
      }
      turnstileWidgetIdRef.current = null;
    }

    function mountWidget() {
      if (disposed || !turnstileContainerRef.current) return;
      const ts = getTurnstile();
      if (!ts) return;

      removeWidget();

      turnstileWidgetIdRef.current = ts.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => updateField("turnstileToken", token),
        "expired-callback": () => updateField("turnstileToken", ""),
        "error-callback": () => updateField("turnstileToken", "")
      });
    }

    function ensureScriptThenMount() {
      if (disposed) return;
      if (getTurnstile()) {
        mountWidget();
        return;
      }

      let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }

      const onLoad = () => {
        if (!disposed) mountWidget();
      };
      script.addEventListener("load", onLoad);
      if (getTurnstile()) onLoad();

      return () => {
        script?.removeEventListener("load", onLoad);
      };
    }

    const removeScriptListener = ensureScriptThenMount();

    return () => {
      disposed = true;
      removeScriptListener?.();
      removeWidget();
    };
  }, [turnstileEnabled, turnstileSiteKey, updateField]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedOnce(true);

    const validationErrors = validateContactForm(values, turnstileEnabled);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          turnstileToken: values.turnstileToken
        })
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setToast({
          type: "error",
          message: payload.error ?? "Unable to send message right now. Please try again."
        });
        return;
      }

      setValues(INITIAL_VALUES);
      setErrors({});
      setSubmittedOnce(false);

      const ts = getTurnstile();
      if (ts && turnstileWidgetIdRef.current) {
        try {
          ts.reset(turnstileWidgetIdRef.current);
        } catch {
          /* ignore */
        }
      }

      setToast({ type: "success", message: "Message sent. I'll reply by email." });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error while sending message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast ? (
        <div
          className={`fixed left-4 right-4 top-4 z-50 rounded-md px-4 py-3 text-sm font-semibold shadow-soft sm:left-auto sm:right-5 sm:top-5 sm:max-w-sm ${
            toast.type === "error"
              ? "border border-red-500/60 bg-surface text-red-600 dark:text-red-400"
              : "bg-accent text-accent-ink"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-ink">
            Name <span className="font-normal text-muted">(required)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-ink">
            Email <span className="font-normal text-muted">(required)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={320}
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={fieldClass(Boolean(errors.email))}
          />
          {errors.email ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-ink">
            Subject <span className="font-normal text-muted">(required)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            maxLength={120}
            value={values.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className={fieldClass(Boolean(errors.subject))}
          />
          {errors.subject ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-ink">
            Message <span className="font-normal text-muted">(required)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            minLength={10}
            maxLength={4000}
            rows={6}
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={fieldClass(Boolean(errors.message))}
          />
          {errors.message ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p> : null}
        </div>

        {turnstileEnabled ? (
          <div>
            <div ref={turnstileContainerRef} className="min-h-[65px] min-w-0 overflow-x-auto" />
            {errors.turnstileToken ? (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.turnstileToken}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted">Turnstile is not configured in this environment.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-solid w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
      </form>
    </>
  );
}
