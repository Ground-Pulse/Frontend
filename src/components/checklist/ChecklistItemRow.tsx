"use client";

/**
 * One checklist row (UX "Checklist Item Row Design").
 * Status buttons are a segmented radiogroup (arrow keys + Enter), filled with
 * their status colour when selected. Media thumbnails appear under the row.
 * Logging an item takes ≤ 3 taps: status → optional media → next.
 */
import { NotebookPen } from "lucide-react";
import { memo, useRef, useState } from "react";
import { MediaThumbnailStrip, MediaUploadButton } from "@/components/media/Media";
import type { CheckStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { STATUS_META } from "./StatusIcon";

const ORDER: CheckStatus[] = ["PASS", "FAIL", "ATTENTION"];

export function StatusSegmentedControl({
  value,
  onChange,
  disabled,
  label,
}: {
  value: CheckStatus | null;
  onChange: (s: CheckStatus) => void;
  disabled?: boolean;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1 sm:w-[300px]"
      onKeyDown={(e) => {
        const idx = Math.max(0, ORDER.indexOf(value ?? "PASS"));
        const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const next = (idx + dir + ORDER.length) % ORDER.length;
        refs.current[next]?.focus();
        onChange(ORDER[next]);
      }}
    >
      {ORDER.map((s, i) => {
        const M = STATUS_META[s];
        const on = value === s;
        return (
          <button
            key={s}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on || (!value && i === 0) ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(s)}
            className={cn(
              "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors duration-150",
              on ? M.on : "border-transparent text-muted hover:bg-surface hover:text-ink"
            )}
          >
            <M.icon className="h-4 w-4" />
            {M.label}
          </button>
        );
      })}
    </div>
  );
}

function ChecklistItemRow({
  itemName,
  status,
  mediaUrls,
  notes,
  highlight,
  locked,
  onStatus,
  onAddMedia,
  onRemoveMedia,
  onNotes,
  id,
}: {
  id: string;
  itemName: string;
  status: CheckStatus | null;
  mediaUrls: string[];
  notes: string | null;
  highlight?: boolean;
  locked?: boolean;
  onStatus: (s: CheckStatus) => void;
  onAddMedia: (urls: string[]) => void;
  onRemoveMedia: (url: string) => void;
  onNotes: (n: string) => void;
}) {
  const [showNotes, setShowNotes] = useState(!!notes);
  return (
    <div
      id={`item-${id}`}
      className={cn(
        "rounded-xl px-1 py-3 transition-colors",
        highlight && !status && "bg-bad-soft/60 ring-1 ring-bad/40"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium">{itemName}</p>
          {highlight && !status && <p className="text-xs text-bad">Choose a status</p>}
        </div>
        <StatusSegmentedControl value={status} onChange={onStatus} disabled={locked} label={itemName} />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {!locked && <MediaUploadButton onUploaded={onAddMedia} capture label={mediaUrls.length ? "Add more" : "Add media"} />}
        {!locked && (
          <button
            type="button"
            onClick={() => setShowNotes((s) => !s)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:bg-surface-2 hover:text-ink"
            aria-expanded={showNotes}
          >
            <NotebookPen className="h-3.5 w-3.5" /> {notes ? "Edit note" : "Note"}
          </button>
        )}
        {mediaUrls.length > 0 && <span className="text-xs text-muted">{mediaUrls.length} attached</span>}
      </div>
      {mediaUrls.length > 0 && (
        <div className="mt-2">
          <MediaThumbnailStrip urls={mediaUrls} onRemove={locked ? undefined : onRemoveMedia} />
        </div>
      )}
      {showNotes && (
        <textarea
          defaultValue={notes ?? ""}
          onBlur={(e) => onNotes(e.target.value)}
          rows={2}
          placeholder="Optional note for the owner…"
          aria-label={`Note for ${itemName}`}
          disabled={locked}
          className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      )}
    </div>
  );
}

export default memo(ChecklistItemRow);
