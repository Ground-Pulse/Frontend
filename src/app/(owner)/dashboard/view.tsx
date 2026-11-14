"use client";

/**
 * OWNER DASHBOARD (UX screen 1; US-002, S-018 multi-property overview).
 * Property cards with health ring + open-issue badge, issues needing a
 * decision, active repairs, portfolio health, "Add Property" CTA.
 */
import { Activity, AlertTriangle, CalendarClock, CalendarPlus, Home, Plus, Wrench, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PortfolioHealthChart } from "@/components/charts/HealthCharts";
import { IssueListItem, RepairStatusTracker } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import AddPropertyDialog from "@/components/property/AddPropertyDialog";
import PropertyCard from "@/components/property/PropertyCard";
import ScheduleInspectionDialog from "@/components/property/ScheduleInspectionDialog";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, SkeletonCards, SkeletonRows } from "@/components/ui/Feedback";
import StatCard from "@/components/ui/StatCard";
import { useIssues } from "@/hooks/useIssues";
import { useProperties } from "@/hooks/useProperties";
import { useRepairs } from "@/hooks/useRepairs";
import type { Property } from "@/lib/types";
import { CATEGORY_LABEL, dayLabel } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function OwnerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const properties = useProperties();
  const flagged = useIssues({ status: "FLAGGED" });
  const repairs = useRepairs("REQUESTED,ASSIGNED,IN_PROGRESS");
  const { dismissedFirstInspectionPrompt, dismissFirstInspectionPrompt } = usePreferencesStore();

  const [addOpen, setAddOpen] = useState(false);
  const [scheduleFor, setScheduleFor] = useState<Property | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const openSchedule = useCallback((p: Property | null) => {
    setScheduleFor(p);
    setScheduleOpen(true);
  }, []);

  const list = useMemo(() => properties.data ?? [], [properties.data]);
  const scored = list.filter((p) => p.healthScore != null);
  const avg = scored.length ? Math.round(scored.reduce((s, p) => s + (p.healthScore ?? 0), 0) / scored.length) : null;
  const next = list
    .filter((p) => p.nextInspectionDate)
    .sort((a, b) => a.nextInspectionDate!.localeCompare(b.nextInspectionDate!))[0];
  const neverInspected = list.find((p) => !p.lastInspectionDate && !p.nextInspectionDate);

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user?.name.split(" ")[0]}`}
        description="Every property you own, and what changed since the last visit."
        actions={
          <>
            <Button variant="outline" onClick={() => openSchedule(null)} disabled={!list.length}>
              <CalendarPlus className="h-4 w-4" /> Schedule
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add property
            </Button>
          </>
        }
      />

      {neverInspected && !dismissedFirstInspectionPrompt && (
        <div className="gp-fade-up mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-brand/30 bg-brand-soft p-4">
          <CalendarClock className="h-6 w-6 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Schedule your first inspection</p>
            <p className="text-sm text-muted">{neverInspected.name} hasn&apos;t been inspected yet. A verified inspector can visit within days.</p>
          </div>
          <Button onClick={() => openSchedule(neverInspected)}>Schedule now</Button>
          <button type="button" onClick={dismissFirstInspectionPrompt} className="rounded-lg p-2 text-muted hover:bg-surface" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Properties" value={list.length} icon={<Home className="h-4 w-4" />} loading={properties.isLoading} />
        <StatCard
          label="Need your decision"
          value={flagged.data?.length ?? 0}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone={flagged.data?.length ? "bad" : "default"}
          href="/issues"
          loading={flagged.isLoading}
        />
        <StatCard label="Average health" value={avg == null ? "—" : `${avg}`} hint={avg == null ? undefined : "out of 100"} icon={<Activity className="h-4 w-4" />} tone="ok" loading={properties.isLoading} />
        <StatCard
          label="Next inspection"
          value={next ? dayLabel(next.nextInspectionDate!) : "None"}
          hint={next?.name}
          icon={<CalendarClock className="h-4 w-4" />}
          tone="info"
          href="/schedule"
          loading={properties.isLoading}
        />
      </div>

      <section className="mt-8" aria-labelledby="props-h">
        <h2 id="props-h" className="mb-4 text-lg font-semibold">Your properties</h2>
        {properties.isLoading ? (
          <SkeletonCards count={3} />
        ) : properties.isError ? (
          <ErrorState message="Couldn't load your properties." onRetry={() => properties.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<Home className="h-6 w-6" />}
            title="No properties yet"
            description="Add your first property to get started — it takes about a minute."
            action={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add property</Button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PropertyCard key={p.id} property={p} onSchedule={openSchedule} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3" aria-labelledby="decide-h">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="decide-h" className="text-lg font-semibold">Needs your decision</h2>
            <Link href="/issues" className="text-sm font-medium text-brand hover:underline">All issues</Link>
          </div>
          {flagged.isLoading ? (
            <SkeletonRows count={2} />
          ) : flagged.isError ? (
            <ErrorState message="Couldn't load issues." onRetry={() => flagged.refetch()} />
          ) : flagged.data?.length ? (
            <div className="space-y-3">
              {flagged.data.slice(0, 4).map((i) => (
                <IssueListItem key={i.id} issue={i} />
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing waiting on you" description="When an inspector flags an issue, you'll approve or decline the repair here." />
          )}
        </section>

        <section className="lg:col-span-2" aria-labelledby="repairs-h">
          <h2 id="repairs-h" className="mb-4 text-lg font-semibold">Active repairs</h2>
          {repairs.isLoading ? (
            <SkeletonRows count={2} />
          ) : repairs.data?.length ? (
            <div className="space-y-3">
              {repairs.data.map((r) => (
                <Link key={r.id} href={`/issue/${r.issueId}`} className="block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{CATEGORY_LABEL[r.issueCategory]} · {r.propertyName}</p>
                      <p className="truncate text-xs text-muted">{r.provider ? r.provider.name : "Waiting for a verified provider"}</p>
                    </div>
                    <Wrench className="h-4 w-4 shrink-0 text-muted" />
                  </div>
                  <RepairStatusTracker status={r.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No repairs in progress" />
          )}
        </section>
      </div>

      {scored.length > 1 && (
        <Card className="mt-8">
          <CardHeader title="Portfolio health" description="Latest health score per property (0–100). 70+ is good, under 40 needs attention." />
          <PortfolioHealthChart data={scored.map((p) => ({ name: p.name, score: p.healthScore! }))} />
        </Card>
      )}

      <AddPropertyDialog open={addOpen} onOpenChange={setAddOpen} onCreated={(p) => openSchedule(p)} />
      <ScheduleInspectionDialog open={scheduleOpen} onOpenChange={setScheduleOpen} property={scheduleFor} properties={list} />
    </>
  );
}
