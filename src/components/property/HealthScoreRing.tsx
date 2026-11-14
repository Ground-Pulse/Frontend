import { scoreColor } from "@/lib/utils";

/**
 * Circular property health score (UX screen 1).
 * Two SVG circles; the coloured arc length = circumference × score / 100.
 * Colour: red 0–40, amber 40–70, green 70–100. Animates on mount (disabled by
 * prefers-reduced-motion via globals.css).
 */
export default function HealthScoreRing({
  score,
  size = 72,
  stroke,
  label,
}: {
  score: number | null;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const sw = stroke ?? Math.max(5, Math.round(size / 11));
  const radius = (size - sw) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = score ?? 0;
  const offset = circumference * (1 - value / 100);
  const color = scoreColor(score);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={score ?? undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={score == null ? "Health score not available yet" : `Health score ${score} of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--gp-border)" strokeWidth={sw} />
        {score != null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={
              {
                "--gp-ring-from": circumference,
                animation: "gp-ring 900ms cubic-bezier(0.16,1,0.3,1) both",
                transition: "stroke-dashoffset 600ms ease, stroke 300ms ease",
              } as React.CSSProperties
            }
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-extrabold tabular-nums" style={{ color, fontSize: Math.max(13, size * 0.28) }}>
          {score ?? "—"}
        </span>
        {label && size >= 96 && <span className="mt-1 text-[11px] font-medium text-muted">{label}</span>}
      </div>
    </div>
  );
}
