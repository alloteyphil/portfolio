import Link from "next/link";
import { AccraClock } from "@/components/accra-clock";

const LINKS = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/resume.pdf", label: "Résumé", external: true },
  { href: "https://www.linkedin.com/in/alloteyphilip/", label: "LinkedIn", external: true }
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line py-8 sm:mt-36">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted">
          <span>© {year} Philip Allotey</span>
          <span>
            Accra, <AccraClock /> GMT
          </span>
          <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">
            Press{" "}
            <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-ink">
              ?
            </kbd>{" "}
            for keyboard shortcuts
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-1 gap-y-1 text-sm" aria-label="Footer">
          {LINKS.map((link) => {
            const className =
              "rounded-xs px-2 py-1 text-ink/75 transition-colors first:pl-0 hover:bg-accent hover:text-accent-ink sm:first:pl-2";
            if ("external" in link) {
              return (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {link.label}
                </a>
              );
            }
            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
