"use client";

import Link from "next/link";
import { CategoryTag, StarRating } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import { useRepairs } from "@/hooks/useRepairs";
import { formatDate, formatINR } from "@/lib/utils";

export default function ProviderHistoryPage() {
  const q = useRepairs("COMPLETED");
  return (
    <>
      <PageHeader title="Job history" description="Completed repairs and owner ratings." />
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load history." onRetry={() => q.refetch()} />
      ) : !q.data?.length ? (
        <EmptyState title="No completed jobs yet" />
      ) : (
        <div className="space-y-3">
          {q.data.map((j) => (
            <Link key={j.id} href={`/issue/${j.issueId}`} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-brand/40">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryTag category={j.issueCategory} />
                  <span className="text-xs text-muted">Completed {formatDate(j.updatedAt)}</span>
                </div>
                <p className="mt-1 font-semibold">{j.propertyName}, {j.propertyCity}</p>
                <p className="line-clamp-1 text-sm text-muted">{j.completionNotes}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatINR(j.costEstimate)}</p>
                {j.ownerRating ? <StarRating value={j.ownerRating} readOnly /> : <p className="text-xs text-muted">Not rated yet</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
