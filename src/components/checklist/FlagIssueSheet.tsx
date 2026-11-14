"use client";

/**
 * Flag Issue sheet (US-006). Category + description + at least one photo.
 * Slides up from the bottom on phones (Dialog handles that).
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CATEGORY_ICON } from "@/components/issue/IssueParts";
import { MediaThumbnailStrip, MediaUploadButton } from "@/components/media/Media";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useFlagIssue } from "@/hooks/useIssues";
import { errorMessage } from "@/lib/errors";
import type { FlagIssueInput, IssueCategory } from "@/lib/types";
import { CATEGORY_LABEL, cn } from "@/lib/utils";

const flagIssueSchema = z.object({
  inspectionId: z.string(),
  category: z.enum(["LEAK", "ELECTRICAL", "SECURITY", "CLEANLINESS", "OTHER"]),
  description: z.string().trim().min(10, "Describe the problem in a sentence or two (10+ characters)").max(1000),
  mediaUrls: z.array(z.string()).min(1, "At least one photo is required"),
});

const CATEGORIES: IssueCategory[] = ["LEAK", "ELECTRICAL", "SECURITY", "CLEANLINESS", "OTHER"];

export default function FlagIssueSheet({
  open,
  onOpenChange,
  inspectionId,
  presetDescription,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  inspectionId: string;
  presetDescription?: string;
}) {
  const flag = useFlagIssue();
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FlagIssueInput>({
    resolver: zodResolver(flagIssueSchema),
    defaultValues: { inspectionId, category: "OTHER", description: presetDescription ?? "", mediaUrls: [] },
  });

  const onSubmit = (data: FlagIssueInput) =>
    flag.mutate(data, {
      onSuccess: () => {
        toast.success("Issue flagged", { description: "The owner has been notified." });
        reset();
        onOpenChange(false);
      },
      onError: (e) => toast.error("Couldn't flag the issue", { description: errorMessage(e) }),
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Flag an issue"
      description="The owner is notified immediately and decides whether to approve a repair."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="danger" loading={flag.isPending} onClick={handleSubmit(onSubmit)}>
            Flag issue
          </Button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Category</legend>
              <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICON[c];
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={field.value === c}
                      onClick={() => field.onChange(c)}
                      className={cn(
                        "flex h-12 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors",
                        field.value === c ? "border-bad bg-bad-soft text-bad" : "border-line hover:bg-surface-2"
                      )}
                    >
                      <Icon className="h-4 w-4" /> {CATEGORY_LABEL[c]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        <div>
          <label htmlFor="flag-desc" className="mb-1.5 block text-sm font-medium">Description</label>
          <Textarea id="flag-desc" rows={3} placeholder="What's wrong, where exactly, and how urgent it looks." error={errors.description?.message} {...register("description")} />
        </div>

        <Controller
          control={control}
          name="mediaUrls"
          render={({ field }) => (
            <div>
              <p className="mb-2 text-sm font-medium">
                Photos / video <span className="text-bad">*</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <MediaThumbnailStrip urls={field.value} size={80} onRemove={(u) => field.onChange(field.value.filter((x) => x !== u))} />
                <MediaUploadButton variant="tile" capture label="Add" onUploaded={(urls) => field.onChange([...field.value, ...urls])} />
              </div>
              {errors.mediaUrls && <p className="mt-1.5 text-xs text-bad" role="alert">{errors.mediaUrls.message}</p>}
            </div>
          )}
        />
      </form>
    </Dialog>
  );
}
