"use client";

/**
 * Add / edit property form (US-001). React Hook Form + Zod.
 * Validation: address required, at least one cover photo required.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MediaUploadButton } from "@/components/media/Media";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import { CITIES, PROPERTY_TYPES } from "@/lib/checklist-templates";
import type { CreatePropertyInput } from "@/lib/types";

export const propertySchema = z.object({
  name: z.string().trim().min(2, "Give the property a short name").max(60),
  address: z.string().trim().min(5, "Address is required"),
  city: z.string().min(1, "Choose a city"),
  type: z.string().min(1, "Choose a property type"),
  coverPhotoUrl: z.string().min(1, "At least one photo is required"),
});

export default function PropertyForm({
  defaultValues,
  submitLabel = "Save property",
  onSubmit,
  pending,
  onCancel,
}: {
  defaultValues?: Partial<CreatePropertyInput>;
  submitLabel?: string;
  onSubmit: (v: CreatePropertyInput) => void;
  pending?: boolean;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: { name: "", address: "", city: "Bengaluru", type: "Apartment", coverPhotoUrl: "", ...defaultValues },
  });
  const cover = watch("coverPhotoUrl");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <span className="mb-1.5 block text-sm font-medium">
          Cover photo <span className="text-bad">*</span>
        </span>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2 text-muted">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="Cover preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
          </div>
          <div>
            <MediaUploadButton
              accept="image/*"
              multiple={false}
              label={cover ? "Change photo" : "Upload photo"}
              onUploaded={([url]) => setValue("coverPhotoUrl", url, { shouldValidate: true })}
            />
            <p className="mt-1.5 text-xs text-muted">JPG or PNG. A front or entrance view works best.</p>
          </div>
        </div>
        {errors.coverPhotoUrl && <p className="mt-1.5 text-xs text-bad" role="alert">{errors.coverPhotoUrl.message}</p>}
      </div>

      <div>
        <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium">Property name</label>
        <Input id="pf-name" placeholder="e.g. Lakeside Apartment" error={errors.name?.message} {...register("name")} />
      </div>

      <div>
        <label htmlFor="pf-address" className="mb-1.5 block text-sm font-medium">
          Full address <span className="text-bad">*</span>
        </label>
        <Input id="pf-address" placeholder="Flat / house no., building, street, area" error={errors.address?.message} {...register("address")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-city" className="mb-1.5 block text-sm font-medium">City</label>
          <Select id="pf-city" error={errors.city?.message} {...register("city")}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="pf-type" className="mb-1.5 block text-sm font-medium">Property type</label>
          <Select id="pf-type" error={errors.type?.message} {...register("type")}>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
