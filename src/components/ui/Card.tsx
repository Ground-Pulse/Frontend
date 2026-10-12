import { cn } from "@/lib/utils";

/** White panel used for every box on the dashboards. */
export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-[0_1px_2px_rgba(34,35,31,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}
