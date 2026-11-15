import type { Metadata } from "next";
import { AccraClock } from "@/components/accra-clock";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";

const DESCRIPTION = "Send Philip Allotey a message about a freelance or contract project. He replies by email.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  openGraph: { title: "Contact", description: DESCRIPTION, url: "/contact" }
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Tell me what you're building.">
        A freelance project, a product that needs another pair of hands, or a bug nobody can pin down. This goes
        straight to my inbox and I reply by email.
      </PageHeader>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-24">
        <ContactForm />
        <aside className="order-first text-[15px] leading-relaxed text-ink/80 lg:order-none">
          <ul className="space-y-3 border-l-2 border-accent pl-5">
            <li>
              It&apos;s <AccraClock className="font-semibold text-ink" /> in Accra (GMT). If that&apos;s late, expect my
              reply the next morning.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              Open to freelance and contract projects.
            </li>
            <li>
              Prefer LinkedIn?{" "}
              <a
                href="https://www.linkedin.com/in/alloteyphilip/"
                target="_blank"
                rel="noopener noreferrer"
                className="link font-semibold text-ink"
              >
                Message me there
              </a>
              .
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
