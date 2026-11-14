"use client";

/** Custom checklist templates per property type (C-020). */
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import Input from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import { toast } from "@/components/ui/Toast";
import { useSaveTemplate, useTemplates } from "@/hooks/useAdmin";
import { errorMessage } from "@/lib/errors";
import type { ChecklistTemplate } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

function Editor({ template }: { template: ChecklistTemplate }) {
  const [items, setItems] = useState(template.items);
  const save = useSaveTemplate();
  const dirty = JSON.stringify(items) !== JSON.stringify(template.items);
  const update = (i: number, key: "roomArea" | "itemName", v: string) => setItems((list) => list.map((x, j) => (j === i ? { ...x, [key]: v } : x)));

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {items.length} items · last updated <span className="font-mono">{formatDateTime(template.updatedAt)}</span> · applies to newly scheduled inspections
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!dirty} onClick={() => setItems(template.items)}>Discard</Button>
          <Button
            size="sm"
            disabled={!dirty}
            loading={save.isPending}
            onClick={() =>
              save.mutate(
                { id: template.id, items },
                {
                  onSuccess: () => toast.success("Template saved"),
                  onError: (e) => toast.error("Couldn't save", { description: errorMessage(e) }),
                }
              )
            }
          >
            Save template
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="hidden grid-cols-[1fr_2fr_auto] gap-2 px-1 text-xs font-medium uppercase tracking-wide text-muted sm:grid">
          <span>Room / area</span>
          <span>Checklist item</span>
          <span className="w-11" />
        </div>
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input aria-label={`Room for item ${i + 1}`} value={it.roomArea} onChange={(e) => update(i, "roomArea", e.target.value)} className="h-10" />
            <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
              <Input aria-label={`Item ${i + 1}`} value={it.itemName} onChange={(e) => update(i, "itemName", e.target.value)} className="h-10" />
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-11 text-muted hover:text-bad" aria-label={`Remove item ${i + 1}`} onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="secondary" size="sm" className="mt-4" onClick={() => setItems((l) => [...l, { roomArea: l[l.length - 1]?.roomArea ?? "", itemName: "" }])}>
        <Plus className="h-4 w-4" /> Add item
      </Button>
    </Card>
  );
}

export default function TemplatesPage() {
  const q = useTemplates();
  const [active, setActive] = useState("Apartment");
  const t = q.data?.find((x) => x.propertyType === active);
  return (
    <>
      <PageHeader title="Checklist templates" description="The room-by-room checklist inspectors fill for each property type." />
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load templates." onRetry={() => q.refetch()} />
      ) : (
        <>
          <div className="mb-5">
            <Tabs label="Property type" value={active} onChange={setActive} tabs={(q.data ?? []).map((x) => ({ value: x.propertyType, label: x.propertyType, count: x.items.length }))} />
          </div>
          {t && <Editor key={t.id + t.updatedAt} template={t} />}
        </>
      )}
    </>
  );
}
