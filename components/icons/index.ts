/**
 * Portfolio icon library — re-exports from [Lucide](https://lucide.dev/icons/).
 *
 * Defaults: use `strokeWidth={iconStroke}` and a `size-*` / `iconNavClass` / `iconButtonClass` class so icons match the terminal UI.
 */
export type { LucideIcon } from "lucide-react";

/** Slightly softer than default 2 — reads better at small sizes with Geist Mono nearby */
export const iconStroke = 1.75;

/** Primary nav pills (`text-xs` / `text-sm`) */
export const iconNavClass = "size-3.5 shrink-0 opacity-90 sm:size-4";

/** Home CTAs, project card actions */
export const iconButtonClass = "size-4 shrink-0 sm:size-[1.125rem]";

export {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  FileText,
  FolderGit2,
  FolderKanban,
  Globe,
  Home,
  Layers,
  Lock,
  Mail,
  Monitor,
  Moon,
  Sun,
  Terminal,
  User
} from "lucide-react";
