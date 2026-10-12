import Card from "./Card";

/** One number + label box, used in the row of counts on both dashboards. */
export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-[#6B6B63]">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#6B6B63]">{hint}</p>}
    </Card>
  );
}
