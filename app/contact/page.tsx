import { TerminalFrame } from "@/components/terminal-frame";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <TerminalFrame title="~/contact">
      <p className="mb-6 text-sm text-terminal-text/85">
        Send a message using the form below. Submissions are protected by Turnstile and sent via Resend.
      </p>
      <ContactForm />
    </TerminalFrame>
  );
}
