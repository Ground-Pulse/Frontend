"use client";

/** Owner → Issues & Repairs: every flagged issue with its decision/repair state. */
import { useState } from "react";
import { IssueListItem } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import Tabs from "@/components/ui/Tabs";
import { useIssues } from "@/hooks/useIssues";

type Tab = "FLAGGED" | "APPROVED" | "CLOSED" | "DECLINED";

export default function OwnerIssuesPage() {
  const issues = useIssues();
  const [tab, setTab] = useState<Tab>("FLAGGED");
  const all = issues.data ?? [];
  const count = (s: Tab) => all.filter((i) => i.status === s).length;
  const shown = all.filter((i) => i.status === tab);

  return (
    <>
      <PageHeader title="Issues & repairs" description="No repair happens without your explicit approval." />
      <div className="mb-5">
        <Tabs
          label="Issue status"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "FLAGGED", label: "Needs decision", count: count("FLAGGED") },
            { value: "APPROVED", label: "Repair underway", count: count("APPROVED") },
            { value: "CLOSED", label: "Resolved", count: count("CLOSED") },
            { value: "DECLINED", label: "Declined", count: count("DECLINED") },
          ]}
        />
      </div>
      {issues.isLoading ? (
        <SkeletonRows />
      ) : issues.isError ? (
        <ErrorState message="Couldn't load issues." onRetry={() => issues.refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState title={tab === "FLAGGED" ? "Nothing needs your decision" : "Nothing here yet"} />
      ) : (
        <div className="space-y-3">
          {shown.map((i) => (
            <IssueListItem key={i.id} issue={i} />
          ))}
        </div>
      )}
    </>
  );
}
