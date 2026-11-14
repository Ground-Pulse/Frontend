"use client";

/**
 * PROPERTY DETAIL (UX screen 2). Health score + inspection history timeline,
 * latest report, open issues, documents (C-021), schedule/edit/archive.
 */
import { Archive, CalendarPlus, CheckCircle2, ChevronRight, FileText, MapPin, Pencil, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HealthTrendChart } from "@/components/charts/HealthCharts";
import { IssueListItem } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import HealthScoreRing from "@/components/property/HealthScoreRing";
import PropertyForm from "@/components/property/PropertyForm";
import ScheduleInspectionDialog from "@/components/property/ScheduleInspectionDialog";
import Badge, { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { ConfirmDialog, Dialog } from "@/components/ui/Dialog";
import { EmptyState, ErrorState, Skeleton, SkeletonRows } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import { toast } from "@/components/ui/Toast";
import { useInspections } from "@/hooks/useInspections";
import { useIssues } from "@/hooks/useIssues";
import {
  useAddDocument,
  useArchiveProperty,
  useDeleteDocument,
  useHealthHistory,
  useProperty,
  usePropertyDocuments,
  useUpdateProperty,
} from "@/hooks/useProperties";
import { errorMessage } from "@/lib/errors";
import { uploadMedia } from "@/lib/media";
import type { PropertyDocument } from "@/lib/types";
import { cn, dayLabel, formatDate, recurrenceLabel, scoreColor } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

function Documents({ propertyId, canEdit }: { propertyId: string; canEdit: boolean }) {
  const docs = usePropertyDocuments(propertyId);
  const add = useAddDocument(propertyId);
  const del = useDeleteDocument(propertyId);
  const [kind, setKind] = useState<PropertyDocument["kind"]>("DEED");
  return (
    <Card>
      <CardHeader title="Documents" description="Deeds, insurance and utility documents, kept with the property." />
      {canEdit && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="w-40">
            <Select value={kind} onChange={(e) => setKind(e.target.value as PropertyDocument["kind"])} aria-label="Document type" className="h-9">
              <option value="DEED">Deed</option>
              <option value="INSURANCE">Insurance</option>
              <option value="UTILITY">Utility bill</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
          <DocUpload onFile={(name, url, size) => add.mutate({ name, url, sizeBytes: size, kind }, { onSuccess: () => toast.success("Document uploaded") })} />
        </div>
      )}
      {docs.isLoading ? (
        <SkeletonRows count={2} />
      ) : !docs.data?.length ? (
        <p className="text-sm text-muted">No documents yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {docs.data.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-3">
              <FileText className="h-5 w-5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <a href={d.url} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium hover:underline">{d.name}</a>
                <p className="text-xs text-muted">
                  {d.kind.charAt(0) + d.kind.slice(1).toLowerCase()} · {(d.sizeBytes / 1024 / 1024).toFixed(1)} MB · {formatDate(d.uploadedAt)}
                </p>
              </div>
              {canEdit && (
                <button type="button" onClick={() => del.mutate(d.id)} className="rounded-lg p-2 text-muted hover:bg-bad-soft hover:text-bad" aria-label={`Delete ${d.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DocUpload({ onFile }: { onFile: (name: string, url: string, size: number) => void }) {
  return (
    <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border border-line px-3 text-sm font-medium hover:bg-surface-2">
      <Upload className="h-4 w-4" /> Upload PDF
      <input
        type="file"
        accept="application/pdf,image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f)
            uploadMedia(f)
              .then((url) => onFile(f.name, url, f.size))
              .catch((err) => toast.error("Upload failed", { description: errorMessage(err) }));
          e.target.value = "";
        }}
      />
    </label>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const isOwner = role === "OWNER";
  const property = useProperty(id);
  const history = useHealthHistory(id);
  const inspections = useInspections({ propertyId: id });
  const issues = useIssues({ propertyId: id });
  const update = useUpdateProperty(id);
  const archive = useArchiveProperty();
  const [tab, setTab] = useState<"overview" | "history" | "documents">("overview");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  if (property.isError)
    return <ErrorState message={errorMessage(property.error, "Couldn't load this property.")} onRetry={() => property.refetch()} />;

  const p = property.data;
  const all = inspections.data ?? [];
  const upcoming = all.filter((i) => i.status !== "SUBMITTED");
  const past = all.filter((i) => i.status === "SUBMITTED").reverse();
  const latest = past[0];
  const open = (issues.data ?? []).filter((i) => i.status === "FLAGGED" || i.status === "APPROVED");

  return (
    <>
      <PageHeader
        back={isOwner ? { href: "/dashboard", label: "Dashboard" } : { href: "/admin/dashboard", label: "Overview" }}
        title={p ? p.name : <Skeleton className="h-8 w-64" />}
        description={
          p && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {p.address}, {p.city} · {p.type}
              {p.ownerName && !isOwner && <> · Owner: {p.ownerName}</>}
            </span>
          )
        }
        actions={
          isOwner && p ? (
            <>
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button onClick={() => setScheduleOpen(true)}>
                <CalendarPlus className="h-4 w-4" /> Schedule inspection
              </Button>
            </>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-4 text-center lg:col-span-1">
          {p ? (
            <>
              <div className="h-40 w-full overflow-hidden rounded-xl bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverPhotoUrl} alt={`${p.name} cover`} className="h-full w-full object-cover" />
              </div>
              <HealthScoreRing score={p.healthScore} size={120} label="Health" />
              <p className="text-sm text-muted">
                {p.healthScore == null
                  ? "Health score appears after the first inspection."
                  : p.healthScore >= 70
                    ? "In good condition."
                    : p.healthScore >= 40
                      ? "Some items need attention."
                      : "Needs urgent attention."}
              </p>
              <dl className="grid w-full grid-cols-2 gap-3 border-t border-line pt-4 text-left text-sm">
                <div>
                  <dt className="text-xs text-muted">Last inspected</dt>
                  <dd className="font-medium">{formatDate(p.lastInspectionDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Next visit</dt>
                  <dd className="font-medium">{p.nextInspectionDate ? dayLabel(p.nextInspectionDate) : "Not scheduled"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Open issues</dt>
                  <dd className={cn("font-medium", p.openIssueCount ? "text-bad" : "text-ok")}>{p.openIssueCount}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Registered</dt>
                  <dd className="font-medium">{formatDate(p.createdAt)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <Skeleton className="h-80 w-full" />
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Tabs
            label="Property sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "overview", label: "Overview" },
              { value: "history", label: "Inspection history", count: past.length },
              { value: "documents", label: "Documents" },
            ]}
          />

          {tab === "overview" && (
            <>
              {upcoming.length > 0 && (
                <Card className="flex flex-wrap items-center gap-4 border-info/30 bg-info-soft">
                  <CalendarPlus className="h-5 w-5 text-info" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold text-ink">
                      {upcoming[0].status === "IN_PROGRESS" ? "Inspection in progress" : "Inspection scheduled"} · {dayLabel(upcoming[0].scheduledDate)}
                    </p>
                    <p className="text-muted">
                      {upcoming[0].inspectorName ? `${upcoming[0].inspectorName} (verified)` : "An inspector will be assigned shortly"} · {recurrenceLabel(upcoming[0].recurrenceRule)}
                    </p>
                  </div>
                  <StatusBadge status={upcoming[0].status} />
                </Card>
              )}

              <Card>
                <CardHeader title="Health score over time" description="Recalculated after every completed inspection." />
                {history.isLoading ? (
                  <Skeleton className="h-52 w-full" />
                ) : (history.data?.length ?? 0) < 1 ? (
                  <p className="py-10 text-center text-sm text-muted">No inspections yet for this property.</p>
                ) : (
                  <HealthTrendChart data={history.data!} />
                )}
              </Card>

              <Card>
                <CardHeader
                  title="Latest report"
                  action={latest && <Link href={`/report/${latest.id}`} className="text-sm font-medium text-brand hover:underline">Open full report</Link>}
                />
                {inspections.isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : latest ? (
                  <Link href={`/report/${latest.id}`} className="flex items-center gap-4 rounded-xl bg-surface-2 p-4 hover:brightness-[0.98]">
                    <FileText className="h-8 w-8 text-brand" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">Inspection on {formatDate(latest.scheduledDate)}</p>
                      <p className="text-sm text-muted">
                        {latest.inspectorName} · {latest.itemsTotal} checks · {latest.issueCount ? `${latest.issueCount} issue${latest.issueCount > 1 ? "s" : ""} flagged` : "no issues"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-subtle" />
                  </Link>
                ) : (
                  <p className="text-sm text-muted">No inspections yet for this property.</p>
                )}
              </Card>

              <section>
                <h2 className="mb-3 text-base font-semibold">Open issues</h2>
                {issues.isLoading ? (
                  <SkeletonRows count={2} />
                ) : open.length ? (
                  <div className="space-y-3">
                    {open.map((i) => (
                      <IssueListItem key={i.id} issue={i} showProperty={false} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-4 text-sm text-ok">
                    <CheckCircle2 className="h-4 w-4" /> No open issues.
                  </div>
                )}
              </section>
            </>
          )}

          {tab === "history" &&
            (past.length === 0 ? (
              <EmptyState title="No inspections yet for this property." />
            ) : (
              <ol className="relative space-y-4 border-l-2 border-line pl-6">
                {past.map((i) => {
                  const score = history.data?.find((h) => h.date === i.scheduledDate)?.score ?? null;
                  return (
                    <li key={i.id} className="relative">
                      <span className="absolute -left-[33px] top-4 h-4 w-4 rounded-full border-4 border-canvas" style={{ background: scoreColor(score) }} aria-hidden />
                      <Link href={`/report/${i.id}`} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-brand/40">
                        <HealthScoreRing score={score} size={48} />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{formatDate(i.scheduledDate)}</p>
                          <p className="text-sm text-muted">
                            {i.inspectorName} · {i.issueCount ? <span className="text-bad">{i.issueCount} issue{i.issueCount > 1 ? "s" : ""}</span> : "no issues"}
                          </p>
                        </div>
                        <Badge tone="neutral">Report</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ))}

          {tab === "documents" && <Documents propertyId={id} canEdit={isOwner} />}

          {isOwner && (
            <div className="border-t border-line pt-4">
              <Button variant="ghost" size="sm" className="text-muted" onClick={() => setArchiveOpen(true)}>
                <Archive className="h-4 w-4" /> Archive property
              </Button>
            </div>
          )}
        </div>
      </div>

      {p && (
        <>
          <ScheduleInspectionDialog open={scheduleOpen} onOpenChange={setScheduleOpen} property={p} />
          <Dialog open={editOpen} onOpenChange={setEditOpen} title="Edit property" description="Changes are recorded in the audit log.">
            <PropertyForm
              defaultValues={p}
              pending={update.isPending}
              onCancel={() => setEditOpen(false)}
              onSubmit={(v) =>
                update.mutate(v, {
                  onSuccess: () => {
                    toast.success("Property updated");
                    setEditOpen(false);
                  },
                  onError: (e) => toast.error("Couldn't save", { description: errorMessage(e) }),
                })
              }
            />
          </Dialog>
          <ConfirmDialog
            open={archiveOpen}
            onOpenChange={setArchiveOpen}
            title="Archive this property?"
            description="It will be hidden from your dashboard. History is kept. Properties with open inspections or issues can't be archived."
            confirmLabel="Archive"
            tone="danger"
            loading={archive.isPending}
            onConfirm={() =>
              archive.mutate(id, {
                onSuccess: () => {
                  toast.success("Property archived");
                  router.push("/dashboard");
                },
                onError: (e) => {
                  setArchiveOpen(false);
                  toast.error("Couldn't archive", { description: errorMessage(e) });
                },
              })
            }
          />
        </>
      )}
    </>
  );
}
