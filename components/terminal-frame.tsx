import type { ReactNode } from "react";

type TerminalFrameProps = {
  title: string;
  children: ReactNode;
};

export function TerminalFrame({ title, children }: TerminalFrameProps) {
  return (
    <section className="terminal-panel">
      <header className="mb-6 flex items-center justify-between border-b border-terminal-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <p className="text-xs text-terminal-amber">{title}</p>
      </header>
      {children}
    </section>
  );
}
