"use client";

import InspectionListItem from "@/components/inspection/InspectionListItem";
import { PageHeader } from "@/components/layout/AppShell";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import { useInspections } from "@/hooks/useInspections";

export default function InspectorHistoryPage() {
  const q = useInspections({ status: "SUBMITTED" });
  const list = [...(q.data ?? [])].reverse();
  return (
    <>
      <PageHeader title="Inspection history" description="Every checklist you've submitted, newest first." />
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load history." onRetry={() => q.refetch()} />
      ) : list.length === 0 ? (
        <EmptyState title="No submitted inspections yet." />
      ) : (
        <div className="space-y-3">
          {list.map((i) => (
            <InspectionListItem key={i.id} inspection={i} href={`/report/${i.id}`} />
          ))}
        </div>
      )}
    </>
  );
}
