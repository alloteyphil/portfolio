"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, FileText, FolderKanban, Home, Layers, Mail, Sun, User, iconStroke } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

type DrawerLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
};

const LINKS: DrawerLink[] = [
  { href: "/", label: "~/home", icon: Home },
  { href: "/projects", label: "~/projects", icon: FolderKanban },
  { href: "/about", label: "~/about", icon: User },
  { href: "/contact", label: "~/contact", icon: Mail },
  { href: "/resume.pdf", label: "~/resume", icon: FileText, external: true }
];

export function HeaderDrawers() {
  const pathname = usePathname();

  return (
    <div className="ml-auto flex items-center gap-2">
      <details className="group relative">
        <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-2.5 text-xs text-terminal-text transition hover:border-terminal-amber hover:text-terminal-amber md:h-10 md:px-3 md:text-sm">
          <Layers className="size-4" strokeWidth={iconStroke} aria-hidden />
          links
        </summary>
        <div className="absolute right-0 top-[calc(100%+0.45rem)] z-30 min-w-52 rounded-lg border border-terminal-border bg-terminal-panel/95 p-2 shadow-terminal backdrop-blur-sm">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = !link.external && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition md:text-sm ${
                    active
                      ? "border-terminal-accent bg-terminal-accent/10 text-terminal-accent"
                      : "border-transparent text-terminal-text hover:border-terminal-border hover:bg-terminal-bg/70 hover:text-terminal-amber"
                  }`}
                >
                  <link.icon className="size-4 shrink-0" strokeWidth={iconStroke} aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </details>

      <details className="group relative">
        <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border border-terminal-border bg-terminal-bg px-2.5 text-xs text-terminal-text transition hover:border-terminal-amber hover:text-terminal-amber md:h-10 md:px-3 md:text-sm">
          <Sun className="size-4" strokeWidth={iconStroke} aria-hidden />
          theme
        </summary>
        <div className="absolute right-0 top-[calc(100%+0.45rem)] z-30 rounded-lg border border-terminal-border bg-terminal-panel/95 p-2 shadow-terminal backdrop-blur-sm">
          <ThemeToggle />
        </div>
      </details>
    </div>
  );
}
