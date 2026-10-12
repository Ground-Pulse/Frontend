/**
 * Circular "property health score" indicator (S-013 in the PRD).
 *
 * Drawn with two SVG circles:
 *  - a grey track
 *  - a coloured arc whose length = strokeDasharray trick
 *    (circumference * score/100)
 *
 * Colour follows the PRD rule: red 0-40, amber 40-70, green 70-100.
 */
export default function HealthRing({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color = score >= 70 ? "#2F7A52" : score >= 40 ? "#C08A28" : "#C4554A";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4DFD2"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
