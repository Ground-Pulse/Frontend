"use client";

import { cn } from "@/lib/utils";

/** Simple accessible tab strip (arrow keys move between tabs). */
export default function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: string; count?: number }[];
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line [scrollbar-width:none]"
      onKeyDown={(e) => {
        const idx = tabs.findIndex((t) => t.value === value);
        if (e.key === "ArrowRight") onChange(tabs[(idx + 1) % tabs.length].value);
        if (e.key === "ArrowLeft") onChange(tabs[(idx - 1 + tabs.length) % tabs.length].value);
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          tabIndex={value === t.value ? 0 : -1}
          onClick={() => onChange(t.value)}
          className={cn(
            "-mb-px flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors",
            value === t.value ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
          )}
        >
          {t.label}
          {t.count != null && (
            <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] tabular-nums", value === t.value ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted")}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
