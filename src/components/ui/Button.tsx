import { cn } from "@/lib/utils";

/**
 * Reusable button, built the shadcn/ui way: the component lives in our own
 * repo (not node_modules) so we can edit it, and variants are plain Tailwind
 * classes merged with cn().
 */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-[#12452E] text-[#FAF8EF] hover:bg-[#0B3523]",
  secondary:
    "bg-[#DCE9DF] text-[#0B3523] hover:bg-[#cfe0d3] border border-[#c7d9cc]",
  ghost: "bg-transparent text-[#12452E] hover:bg-[#F3F0E5]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
