import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "../app/preferences";
import { config } from "../app/config";
import { copy, type BilingualText } from "../content";
import { BilingualBlock } from "./BilingualBlock";
export function RootMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 4v17m0-9L9 5m11 12L31 9M20 21v15m0-15L8 28m12-7 12 8M8 28v7m24-6v6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      <circle cx="20" cy="21" r="3" fill="currentColor" />
    </svg>
  );
}
export function Brand() {
  return (
    <a href="#top" className="brand" aria-label="Jizrak — جِذرك">
      <RootMark />
      <span lang="en" dir="ltr">
        Jizrak
      </span>
      <span className="brand-dash" aria-hidden="true">
        —
      </span>
      <span lang="ar" dir="rtl">
        جِذرك
      </span>
    </a>
  );
}
export function PairedLink({
  text,
  href,
  className = "",
  onClick,
}: {
  text: BilingualText;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const { locale } = usePreferences();
  return (
    <a
      href={href}
      aria-label={text[locale]}
      className={className}
      onClick={onClick}
    >
      <BilingualBlock inline text={text} />
    </a>
  );
}
export function Cta({
  kind = "start",
  compact = false,
}: {
  kind?: "start" | "demo";
  compact?: boolean;
}) {
  const { locale } = usePreferences();
  return (
    <a
      className={`cta ${kind} ${compact ? "compact" : ""}`}
      href={config[kind]}
      aria-label={copy[kind][locale]}
    >
      <BilingualBlock inline text={copy[kind]} />
      <ArrowUpRight aria-hidden="true" size={18} />
    </a>
  );
}
