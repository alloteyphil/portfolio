"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "@/components/icons";
import {
  FileText,
  FolderKanban,
  Home,
  Mail,
  User,
  iconNavClass,
  iconStroke
} from "@/components/icons";

type NavItem = { href: string; label: string; external?: boolean; icon: LucideIcon };

const LINKS: NavItem[] = [
  { href: "/", label: "~/home", icon: Home },
  { href: "/projects", label: "~/projects", icon: FolderKanban },
  { href: "/about", label: "~/about", icon: User },
  { href: "/contact", label: "~/contact", icon: Mail },
  { href: "/resume.pdf", label: "~/resume", external: true, icon: FileText }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3">
      {LINKS.map((link) => {
        const active = !link.external && pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`inline-flex min-h-10 min-w-[2.75rem] items-center justify-center gap-1.5 rounded border px-2.5 py-2 text-xs transition sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-sm ${
              active
                ? "border-terminal-accent text-terminal-accent"
                : "border-terminal-border text-terminal-text hover:border-terminal-amber hover:text-terminal-amber"
            }`}
          >
            <link.icon className={iconNavClass} strokeWidth={iconStroke} aria-hidden />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
