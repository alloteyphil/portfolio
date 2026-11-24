"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/resume.pdf", label: "Résumé", external: true }
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="load-step flex flex-wrap items-center gap-x-6 gap-y-3 py-5 sm:py-7">
      <Link
        href="/"
        className="display text-lg text-heading transition-transform duration-200 hover:-translate-y-0.5"
        aria-label="Philip Allotey, home"
      >
        Philip Allotey
      </Link>

      <nav
        aria-label="Primary"
        className="order-3 flex w-full min-w-0 items-center gap-1 sm:order-none sm:ml-auto sm:w-auto"
      >
        {LINKS.map((link) => {
          const external = "external" in link;
          const className = `nav-pill rounded-xs px-2 py-1 text-[15px] font-medium first:pl-0 sm:first:pl-2 ${
            !external && pathname.startsWith(link.href) ? "text-accent-ink" : "text-ink/75"
          }`;

          if (external) {
            return (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                {link.label}
              </a>
            );
          }

          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto sm:ml-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
