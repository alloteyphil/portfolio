import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedClass = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full"
} as const;

export function Skeleton({ className = "", rounded = "md", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-terminal-border/40 ${roundedClass[rounded]} ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}
