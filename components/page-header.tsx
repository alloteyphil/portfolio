import type { CSSProperties, ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  children?: ReactNode;
};

/** Shared top-of-page block: display title swept in with the selection highlight, optional lede. */
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="pb-12 pt-10 sm:pb-16 sm:pt-16">
      <h1 className="display sel-load max-w-5xl text-5xl text-heading sm:text-7xl">
        <span className="mark">{title}</span>
      </h1>
      {children ? (
        <div
          className="load-step mt-7 max-w-2xl text-lg leading-relaxed text-ink/80 sm:text-xl"
          style={{ "--d": 3 } as CSSProperties}
        >
          {children}
        </div>
      ) : null}
    </header>
  );
}
