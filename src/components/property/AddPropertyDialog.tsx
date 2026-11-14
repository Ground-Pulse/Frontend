"use client";

import { Dialog } from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import { useCreateProperty } from "@/hooks/useProperties";
import { errorMessage } from "@/lib/errors";
import type { Property } from "@/lib/types";
import PropertyForm from "./PropertyForm";

export default function AddPropertyDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated?: (p: Property) => void;
}) {
  const create = useCreateProperty();
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add a property" description="Takes about a minute. You can schedule the first inspection right after.">
      <PropertyForm
        submitLabel="Add property"
        pending={create.isPending}
        onCancel={() => onOpenChange(false)}
        onSubmit={(v) =>
          create.mutate(v, {
            onSuccess: (p) => {
              toast.success("Property added", { description: p.name });
              onOpenChange(false);
              onCreated?.(p);
            },
            onError: (e) => toast.error("Couldn't add property", { description: errorMessage(e) }),
          })
        }
      />
    </Dialog>
  );
}
