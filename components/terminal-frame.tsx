import type { ReactNode } from "react";

type TerminalFrameProps = {
  title: string;
  children: ReactNode;
};

export function TerminalFrame({ title, children }: TerminalFrameProps) {
  return (
    <section className="terminal-panel min-w-0">
      <header className="mb-5 flex flex-col gap-3 border-b border-terminal-border pb-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex shrink-0 items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <p className="min-w-0 truncate text-left text-xs text-terminal-amber sm:text-right">{title}</p>
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
