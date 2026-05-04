import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-terminal-border pt-6 sm:mt-14 sm:pt-8">
      <p className="text-xs text-terminal-amber">$ footer --status=ok</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-terminal-text/65">
          <span>© {year} Philip Allotey</span>
          <span aria-hidden className="hidden text-terminal-border sm:inline">·</span>
          <span className="text-terminal-text/55">
            press{" "}
            <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 font-mono text-[10px] text-terminal-text/85">
              ?
            </kbd>{" "}
            for shortcuts
          </span>
        </p>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs" aria-label="Footer links">
          <Link href="/projects" className="text-terminal-text/75 underline-offset-2 hover:text-terminal-accent hover:underline">
            ~/projects
          </Link>
          <Link href="/about" className="text-terminal-text/75 underline-offset-2 hover:text-terminal-accent hover:underline">
            ~/about
          </Link>
          <Link href="/contact" className="text-terminal-text/75 underline-offset-2 hover:text-terminal-accent hover:underline">
            ~/contact
          </Link>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-text/75 underline-offset-2 hover:text-terminal-accent hover:underline"
          >
            ~/resume
          </Link>
        </nav>
      </div>
    </footer>
  );
}
