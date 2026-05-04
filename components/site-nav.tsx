"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "~/home" },
  { href: "/projects", label: "~/projects" },
  { href: "/about", label: "~/about" },
  { href: "/contact", label: "~/contact" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3 text-sm">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded border px-3 py-1 transition ${
              active
                ? "border-terminal-accent text-terminal-accent"
                : "border-terminal-border text-terminal-text hover:border-terminal-amber hover:text-terminal-amber"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
