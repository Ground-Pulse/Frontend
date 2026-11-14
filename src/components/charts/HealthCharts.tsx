"use client";

/**
 * Health score charts (Recharts). Single series → one hue, no legend box (the
 * card title names it), 2px line, recessive grid, hover tooltip.
 */
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HealthPoint } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const axis = { stroke: "var(--gp-muted)", fontSize: 12, tickLine: false, axisLine: false } as const;

function TooltipBox({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="text-muted">{title}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">Health {value}/100</p>
    </div>
  );
}

export function HealthTrendChart({ data, height = 220 }: { data: HealthPoint[]; height?: number }) {
  const rows = data.map((d) => ({ ...d, label: formatDate(d.date, { year: "2-digit", day: undefined }) }));
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--gp-border)" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="label" {...axis} />
          <YAxis domain={[0, 100]} ticks={[0, 40, 70, 100]} {...axis} />
          <Tooltip
            cursor={{ stroke: "var(--gp-muted)", strokeDasharray: "3 3" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <TooltipBox title={formatDate((payload[0].payload as HealthPoint).date)} value={payload[0].value as number} />
              ) : null
            }
          />
          <Line type="monotone" dataKey="score" stroke="var(--gp-brand)" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "var(--gp-surface)" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PortfolioHealthChart({ data }: { data: { name: string; score: number }[] }) {
  return (
    <div style={{ height: Math.max(160, data.length * 44 + 30) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barCategoryGap={10}>
          <CartesianGrid stroke="var(--gp-border)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 40, 70, 100]} {...axis} />
          <YAxis type="category" dataKey="name" width={130} {...axis} tick={{ fill: "var(--gp-text)", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "var(--gp-surface-2)" }}
            content={({ active, payload }) =>
              active && payload?.length ? <TooltipBox title={String(payload[0].payload.name)} value={payload[0].value as number} /> : null
            }
          />
          <Bar dataKey="score" fill="var(--gp-brand)" radius={[0, 4, 4, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
