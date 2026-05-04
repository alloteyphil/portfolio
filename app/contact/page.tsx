import type { Metadata } from "next";
import { TerminalFrame } from "@/components/terminal-frame";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send Philip a message — Cloudflare Turnstile keeps the bots out, Resend delivers the email.",
  openGraph: {
    title: "Contact",
    description:
      "Send Philip a message — Cloudflare Turnstile keeps the bots out, Resend delivers the email.",
    url: "/contact"
  }
};

export default function ContactPage() {
  return (
    <TerminalFrame title="~/contact">
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-terminal-text/85">
        Got a thing worth building, a bug that haunts you, or just want to say hi? Drop a line — no recruiter template
        required. If Turnstile is on, prove you are human first; then the bits fly to my inbox via Resend.
      </p>
      <ContactForm />
    </TerminalFrame>
  );
}
