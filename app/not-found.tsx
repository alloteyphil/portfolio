import Link from "next/link";
import { TerminalFrame } from "@/components/terminal-frame";

export default function NotFound() {
  return (
    <TerminalFrame title="~/404">
      <p className="text-sm text-terminal-amber">$ ls requested-route</p>
      <h1 className="mt-3 text-2xl font-semibold text-terminal-text">404: route not found</h1>
      <p className="mt-3 max-w-2xl text-terminal-text/80">
        The path you requested does not exist in this portfolio environment.
      </p>
      <div className="mt-6 flex gap-3 text-sm">
        <Link href="/" className="rounded border border-terminal-accent px-4 py-2 text-terminal-accent">
          cd ~/home
        </Link>
        <Link href="/projects" className="rounded border border-terminal-amber px-4 py-2 text-terminal-amber">
          cd ~/projects
        </Link>
      </div>
    </TerminalFrame>
  );
}
