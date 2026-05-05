"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FolderKanban, Mail, User, iconButtonClass, iconStroke } from "@/components/icons";
import { TerminalFrame } from "@/components/terminal-frame";

const HOME_INTRO_LINE = "$ intro: full-stack dev · Accra · builds for real users";

const TYPE_MS = 34;
const DELETE_MS = 22;
/** Hold the full line for ~7s, then backspace and retype immediately. */
const PAUSE_BEFORE_DELETE_MS = 7000;

function useIntroTypewriter(line: string) {
  const [text, setText] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let mode: "forward" | "backward" = "forward";

    const clearTimer = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const schedule = (fn: () => void, ms: number) => {
      clearTimer();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (!cancelled) fn();
      }, ms);
    };

    const step = () => {
      if (cancelled) return;
      if (mode === "forward") {
        if (i < line.length) {
          i += 1;
          setText(line.slice(0, i));
          schedule(step, TYPE_MS);
        } else {
          schedule(() => {
            if (cancelled) return;
            mode = "backward";
            step();
          }, PAUSE_BEFORE_DELETE_MS);
        }
      } else if (i > 0) {
        i -= 1;
        setText(line.slice(0, i));
        schedule(step, DELETE_MS);
      } else {
        mode = "forward";
        step();
      }
    };

    step();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [line]);

  return text;
}

export default function HomePage() {
  const introText = useIntroTypewriter(HOME_INTRO_LINE);

  return (
    <TerminalFrame title="~/home">
      <p className="intro-typer max-w-full text-lg text-terminal-accent sm:max-w-max sm:text-xl">
        <span className="intro-typer__text">{introText}</span>
        <span className="intro-typer__caret" aria-hidden />
      </p>
      <h1 className="mt-4 text-2xl font-semibold leading-tight text-terminal-text sm:text-3xl sm:leading-snug">
        Philip — Full-Stack Developer who ships products people actually use.
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-terminal-text/85 sm:text-base">
        Based in Accra. I build web apps with Next.js and TypeScript, mobile experiences with React Native (Expo), and
        real-time backends that hold up under pressure. Currently Founding Engineer at Clubz — a social app with live
        voice, location features, and real users.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/85 sm:text-base">
        Previously grew a client platform from 1,200 to 62,700+ unique users in 12 months. I care about clean
        architecture, fast iteration, and outcomes you can point at.
      </p>
      <p className="mt-3 max-w-3xl text-sm text-terminal-text/70">
        Take a look around.{" "}
        <Link href="/about#tools" className="text-terminal-amber underline underline-offset-2 hover:text-terminal-accent">
          peek the tools → ~/about#tools
        </Link>
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-accent px-4 py-2.5 text-center text-sm text-terminal-accent transition hover:bg-terminal-accent/10 sm:min-h-0"
        >
          <FolderKanban className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          cd ~/projects
        </Link>
        <Link
          href="/about"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-amber px-4 py-2.5 text-center text-sm text-terminal-amber transition hover:bg-terminal-amber/10 sm:min-h-0"
        >
          <User className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          cat ~/about
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-border px-4 py-2.5 text-center text-sm text-terminal-text/90 transition hover:border-terminal-accent hover:text-terminal-accent sm:min-h-0"
        >
          <Mail className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          mail ~/contact
        </Link>
      </div>
    </TerminalFrame>
  );
}
