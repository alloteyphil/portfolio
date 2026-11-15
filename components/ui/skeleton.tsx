import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedClass = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-2xl",
  full: "rounded-full"
} as const;

export function Skeleton({ className = "", rounded = "md", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-line/70 ${roundedClass[rounded]} ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}
