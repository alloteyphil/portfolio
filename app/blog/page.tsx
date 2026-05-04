import { BookOpen, iconStroke } from "@/components/icons";
import { TerminalFrame } from "@/components/terminal-frame";

export default function BlogPage() {
  return (
    <TerminalFrame title="~/blog">
      <p className="flex flex-wrap items-center gap-2 text-terminal-accent">
        <BookOpen className="size-4 shrink-0 sm:size-[1.125rem]" strokeWidth={iconStroke} aria-hidden />
        <span>$ ls posts/</span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-terminal-text/85 sm:text-base">
        Blog scaffold is ready for MDX integration. Add content wiring when you are ready to publish writing.
      </p>
    </TerminalFrame>
  );
}
