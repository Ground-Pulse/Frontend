"use client";

/**
 * OWNER DASHBOARD (PRD US-002, US-005, US-007, S-013, S-014).
 *
 * What the owner sees:
 *  - counts across all their properties
 *  - one card per property with its health score ring
 *  - the health score trend chart (Recharts)
 *  - flagged issues with Approve / Decline buttons
 *
 * Data comes from src/lib/api.ts through TanStack Query (useQuery), so we get
 * loading states and caching for free.
 */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardShell from "@/components/dashboard/DashboardShell";
import HealthRing from "@/components/dashboard/HealthRing";
import Badge, { toneForStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { api } from "@/lib/api";
import type { IssueStatus } from "@/lib/types";

export default function OwnerDashboard() {
  // Each useQuery has its own cache key, loads independently and is cached.
  const propertiesQuery = useQuery({
    queryKey: ["properties"],
    queryFn: api.getProperties,
  });
  const issuesQuery = useQuery({ queryKey: ["issues"], queryFn: api.getIssues });
  const trendQuery = useQuery({
    queryKey: ["healthTrend"],
    queryFn: api.getHealthTrend,
  });

  // Local approve/decline state. With the real backend this becomes a
  // useMutation that PATCHes /issues/:id and then invalidates the query.
  const [decisions, setDecisions] = useState<Record<string, IssueStatus>>({});

  const properties = propertiesQuery.data ?? [];
  const issues = issuesQuery.data ?? [];

  const openIssues = issues.filter(
    (i) => (decisions[i.id] ?? i.status) === "FLAGGED"
  ).length;

  const avgHealth = properties.length
    ? Math.round(
        properties.reduce((sum, p) => sum + p.healthScore, 0) / properties.length
      )
    : 0;

  return (
    <DashboardShell
      role="OWNER"
      title="Your properties"
      subtitle="Every property you own, and what changed since the last visit."
    >
      {/* ---------- Row of counts ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Properties" value={properties.length} />
        <StatCard label="Open issues" value={openIssues} hint="Need your decision" />
        <StatCard label="Average health" value={`${avgHealth}/100`} />
        <StatCard label="Next inspection" value="13 Oct" hint="Whitefield flat" />
      </div>

      {/* ---------- Property cards ---------- */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Properties</h2>

        {propertiesQuery.isLoading ? (
          <p className="text-sm text-[#6B6B63]">Loading properties…</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {properties.map((p) => (
              <Card key={p.id}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{p.coverPhoto}</span>
                  <HealthRing score={p.healthScore} />
                </div>

                <h3 className="mt-4 font-medium leading-snug">{p.address}</h3>
                <p className="mt-1 text-xs text-[#6B6B63]">{p.type}</p>

                <div className="mt-4 flex items-center justify-between border-t border-[#E4DFD2] pt-3 text-xs text-[#6B6B63]">
                  <span>Last visit: {p.lastInspection ?? "—"}</span>
                  {p.openIssues > 0 ? (
                    <Badge tone="red">{p.openIssues} open</Badge>
                  ) : (
                    <Badge tone="green">All clear</Badge>
                  )}
                </div>

                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Schedule inspection
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Health trend chart (Recharts) ---------- */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">
          Health score trend
        </h2>
        <Card>
          <div className="h-64 w-full">
            {trendQuery.isLoading ? (
              <p className="text-sm text-[#6B6B63]">Loading chart…</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendQuery.data}>
                  <CartesianGrid stroke="#E4DFD2" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#6B6B63" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#6B6B63" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#12452E"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </section>

      {/* ---------- Issues needing a decision ---------- */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">
          Issues flagged by inspectors
        </h2>

        <div className="space-y-3">
          {issuesQuery.isLoading && (
            <p className="text-sm text-[#6B6B63]">Loading issues…</p>
          )}

          {issues.map((issue) => {
            const status = decisions[issue.id] ?? issue.status;
            return (
              <Card key={issue.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral">{issue.category}</Badge>
                      <Badge tone={toneForStatus(status)}>{status}</Badge>
                    </div>
                    <p className="mt-2 text-sm">{issue.description}</p>
                    <p className="mt-1 text-xs text-[#6B6B63]">
                      {issue.propertyAddress} · {issue.photos} photos ·{" "}
                      {issue.createdAt}
                    </p>
                  </div>

                  {/* Owner-gated repairs: nothing happens without approval */}
                  {status === "FLAGGED" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setDecisions((d) => ({ ...d, [issue.id]: "APPROVED" }))
                        }
                      >
                        Approve repair
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setDecisions((d) => ({ ...d, [issue.id]: "DECLINED" }))
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}
