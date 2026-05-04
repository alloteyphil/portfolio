import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-terminal-border pt-6 sm:mt-14 sm:pt-8">
      <p className="text-xs text-terminal-amber">$ footer --status=ok</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-terminal-text/65">
          © {year} Philip Allotey
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
