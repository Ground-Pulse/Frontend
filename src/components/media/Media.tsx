"use client";

/**
 * Media helpers used by checklists, issues, repairs and the property form:
 *  - MediaUploadButton: opens the camera / file picker, uploads, returns URLs
 *  - MediaThumbnailStrip: small thumbnails with optional remove
 *  - MediaGallery: larger grid with a lightbox
 */
import * as RadixDialog from "@radix-ui/react-dialog";
import { Camera, ChevronLeft, ChevronRight, FileText, Loader2, PlayCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/errors";
import { isVideoUrl, uploadMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaUploadButton({
  onUploaded,
  accept = "image/*,video/*",
  multiple = true,
  label = "Add media",
  className,
  variant = "chip",
  capture,
}: {
  onUploaded: (urls: string[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  className?: string;
  variant?: "chip" | "tile";
  capture?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      try {
        urls.push(await uploadMedia(f));
      } catch (err) {
        toast.error("Upload failed", { description: errorMessage(err) });
      }
    }
    setBusy(false);
    if (urls.length) onUploaded(urls);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        {...(capture ? { capture: "environment" } : {})}
        onChange={(e) => handle(e.target.files)}
      />
      {variant === "chip" ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-line px-3 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-60",
            className
          )}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          {busy ? "Uploading…" : label}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            "flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-xs text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-60",
            className
          )}
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          {busy ? "Uploading" : label}
        </button>
      )}
    </>
  );
}

function Thumb({ url, className }: { url: string; className?: string }) {
  if (isVideoUrl(url))
    return (
      <div className={cn("relative bg-black", className)}>
        <video src={url} className="h-full w-full object-cover opacity-80" muted preload="metadata" />
        <PlayCircle className="absolute inset-0 m-auto h-6 w-6 text-white" />
      </div>
    );
  if (url.endsWith("#file") || url.startsWith("data:application/pdf"))
    return (
      <div className={cn("flex items-center justify-center bg-surface-2 text-muted", className)}>
        <FileText className="h-6 w-6" />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={cn("object-cover", className)} loading="lazy" />;
}

export function MediaThumbnailStrip({
  urls,
  onRemove,
  size = 56,
}: {
  urls: string[];
  onRemove?: (url: string) => void;
  size?: number;
}) {
  const [index, setIndex] = useState<number | null>(null);
  if (!urls.length) return null;
  return (
    <>
      <ul className="flex flex-wrap gap-2" aria-label="Attached media">
        {urls.map((u, i) => (
          <li key={u + i} className="relative">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block overflow-hidden rounded-lg border border-line focus-visible:outline-2 focus-visible:outline-ring"
              style={{ width: size, height: size }}
              aria-label={`View attachment ${i + 1}`}
            >
              <Thumb url={u} className="h-full w-full" />
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(u)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-ink p-0.5 text-canvas shadow"
                aria-label="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <Lightbox urls={urls} index={index} onIndex={setIndex} />
    </>
  );
}

export function MediaGallery({ urls, className }: { urls: string[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  if (!urls.length) return <p className="text-sm text-muted">No media attached.</p>;
  return (
    <>
      <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
        {urls.map((u, i) => (
          <button
            key={u + i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "overflow-hidden rounded-xl border border-line focus-visible:outline-2 focus-visible:outline-ring",
              i === 0 && urls.length > 2 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-[4/3]"
            )}
            aria-label={`Open photo ${i + 1} of ${urls.length}`}
          >
            <Thumb url={u} className="h-full w-full" />
          </button>
        ))}
      </div>
      <Lightbox urls={urls} index={index} onIndex={setIndex} />
    </>
  );
}

function Lightbox({ urls, index, onIndex }: { urls: string[]; index: number | null; onIndex: (i: number | null) => void }) {
  const url = index == null ? null : urls[index];
  return (
    <RadixDialog.Root open={index != null} onOpenChange={(o) => !o && onIndex(null)}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[70] bg-black/90" />
        <RadixDialog.Content
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 outline-none"
          onKeyDown={(e) => {
            if (index == null) return;
            if (e.key === "ArrowRight") onIndex((index + 1) % urls.length);
            if (e.key === "ArrowLeft") onIndex((index - 1 + urls.length) % urls.length);
          }}
        >
          <RadixDialog.Title className="sr-only">Media viewer</RadixDialog.Title>
          <RadixDialog.Description className="sr-only">
            Attachment {(index ?? 0) + 1} of {urls.length}. Use arrow keys to navigate.
          </RadixDialog.Description>
          {url &&
            (isVideoUrl(url) ? (
              <video src={url} controls autoPlay className="max-h-full max-w-full rounded-lg" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url.replace("w=800", "w=1600")} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
            ))}
          <RadixDialog.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-5 w-5" />
          </RadixDialog.Close>
          {urls.length > 1 && index != null && (
            <>
              <button type="button" onClick={() => onIndex((index - 1 + urls.length) % urls.length)} className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Previous">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={() => onIndex((index + 1) % urls.length)} className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Next">
                <ChevronRight className="h-6 w-6" />
              </button>
              <p className="absolute bottom-4 text-sm text-white/70">
                {index + 1} / {urls.length}
              </p>
            </>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
