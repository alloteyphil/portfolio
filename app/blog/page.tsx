import { TerminalFrame } from "@/components/terminal-frame";

export default function BlogPage() {
  return (
    <TerminalFrame title="~/blog">
      <p className="text-terminal-accent">$ ls posts/</p>
      <p className="mt-4 text-terminal-text/85">
        Blog scaffold is ready for MDX integration. Add content wiring when you are ready to publish writing.
      </p>
    </TerminalFrame>
  );
}
