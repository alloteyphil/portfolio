"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getTurnstileClientSiteKey } from "@/lib/turnstile-keys";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Set by Turnstile when enabled; omitted or empty when disabled. */
  turnstileToken: string | undefined;
};

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

function getTurnstile(): TurnstileApi | undefined {
  return (globalThis as unknown as { turnstile?: TurnstileApi }).turnstile;
}

function buildContactSchema(turnstileRequired: boolean) {
  return z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
    email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
    subject: z.string().trim().min(2, "Subject must be at least 2 characters.").max(120, "Subject is too long."),
    message: z.string().trim().min(10, "Message must be at least 10 characters.").max(4000, "Message is too long."),
    turnstileToken: turnstileRequired
      ? z.string().trim().min(1, "Complete the Turnstile challenge.")
      : z.string().optional()
  });
}

export function ContactForm() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const turnstileSiteKey = getTurnstileClientSiteKey();
  const turnstileEnabled = Boolean(turnstileSiteKey);
  const schema = useMemo(() => buildContactSchema(turnstileEnabled), [turnstileEnabled]);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  /** Latest widget id for effect cleanup (avoids stale closure on unmount). */
  const turnstileWidgetIdForCleanupRef = useRef<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      turnstileToken: undefined
    }
  });

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!turnstileEnabled || !turnstileSiteKey) return;
    const siteKey = turnstileSiteKey;

    let disposed = false;

    function removeWidget(options?: { updateReactState: boolean }) {
      const updateReactState = options?.updateReactState ?? true;
      const ts = getTurnstile();
      const id = turnstileWidgetIdForCleanupRef.current;
      if (id && ts) {
        try {
          ts.remove(id);
        } catch {
          /* DOM may already be detached */
        }
      }
      turnstileWidgetIdForCleanupRef.current = null;
      if (updateReactState) setTurnstileWidgetId(null);
    }

    function mountWidget() {
      if (disposed || !turnstileContainerRef.current) return;
      const ts = getTurnstile();
      if (!ts) return;

      removeWidget();

      const newId = ts.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setValue("turnstileToken", token, { shouldValidate: true });
        },
        "expired-callback": () => {
          setValue("turnstileToken", undefined, { shouldValidate: true });
        },
        "error-callback": () => {
          setValue("turnstileToken", undefined, { shouldValidate: true });
        }
      });
      turnstileWidgetIdForCleanupRef.current = newId;
      setTurnstileWidgetId(newId);
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
      removeWidget({ updateReactState: false });
    };
  }, [turnstileEnabled, turnstileSiteKey, setValue]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
            turnstileToken: values.turnstileToken ?? ""
          })
        });

        const payload = (await response.json()) as { ok?: boolean; error?: string };
        if (!response.ok || !payload.ok) {
          const errorMessage = payload.error ?? "Unable to send message right now. Please try again.";
          setToast({ type: "error", message: errorMessage });
          return;
        }

        reset({
          name: "",
          email: "",
          subject: "",
          message: "",
          turnstileToken: undefined
        });

        const ts = getTurnstile();
        if (ts && turnstileWidgetId) {
          try {
            ts.reset(turnstileWidgetId);
          } catch {
            /* ignore */
          }
        }

        setToast({ type: "success", message: "Message sent successfully." });
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Network error while sending message. Please try again." });
      }
    },
    [reset, turnstileWidgetId]
  );

  function labelWithRequired(text: string) {
    return (
      <>
        {text} <span className="text-red-400">*</span>
      </>
    );
  }

  function fieldClass(hasError: boolean) {
    return `w-full rounded border bg-transparent px-3 py-2 text-sm outline-none focus:border-terminal-accent ${
      hasError ? "border-red-400" : "border-terminal-border"
    }`;
  }

  return (
    <>
      {toast ? (
        <div
          className={`fixed left-4 right-4 top-4 z-50 rounded border px-3 py-3 text-sm shadow-lg sm:left-auto sm:right-5 sm:top-5 sm:max-w-sm sm:px-4 ${
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Name")}
          </label>
          <input id="contact-name" autoComplete="name" maxLength={100} className={fieldClass(Boolean(errors.name))} {...register("name")} />
          {errors.name ? <p className="mt-1 text-xs text-red-400">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Email")}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            maxLength={320}
            className={fieldClass(Boolean(errors.email))}
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-red-400">{errors.email.message}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Subject")}
          </label>
          <input id="contact-subject" maxLength={120} className={fieldClass(Boolean(errors.subject))} {...register("subject")} />
          {errors.subject ? <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-1 block text-xs text-terminal-amber">
            {labelWithRequired("Message")}
          </label>
          <textarea
            id="contact-message"
            minLength={10}
            maxLength={4000}
            rows={6}
            className={fieldClass(Boolean(errors.message))}
            {...register("message")}
          />
          {errors.message ? <p className="mt-1 text-xs text-red-400">{errors.message.message}</p> : null}
        </div>

        {turnstileEnabled ? (
          <div>
            <div ref={turnstileContainerRef} className="min-h-[65px] min-w-0 overflow-x-auto" />
            {errors.turnstileToken ? (
              <p className="mt-1 text-xs text-red-400">{errors.turnstileToken.message}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-terminal-amber">Turnstile is not configured in this environment.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded border border-terminal-accent px-4 py-2.5 text-sm text-terminal-accent disabled:opacity-60 sm:min-h-0 sm:w-auto sm:justify-start sm:py-2"
        >
          {isSubmitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-terminal-accent border-t-transparent" />
              sending...
            </>
          ) : (
            "send message"
          )}
        </button>
      </form>
    </>
  );
}
