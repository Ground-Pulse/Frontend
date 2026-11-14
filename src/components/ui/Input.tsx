import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form controls. React Hook Form's {...register("x")} props are forwarded
 * (including the ref) so validation works without extra wiring.
 */
const base =
  "w-full rounded-lg border bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-60";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ error, className, ...props }, ref) {
  return (
    <div className="w-full">
      <input
        ref={ref}
        aria-invalid={!!error || undefined}
        className={cn(base, "h-11", error ? "border-bad" : "border-line", className)}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-bad" role="alert">{error}</p>}
    </div>
  );
});
export default Input;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, rows = 3, ...props },
  ref
) {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={!!error || undefined}
        className={cn(base, "py-2.5", error ? "border-bad" : "border-line", className)}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-bad" role="alert">{error}</p>}
    </div>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, className, children, ...props },
  ref
) {
  return (
    <div className="w-full">
      <select
        ref={ref}
        aria-invalid={!!error || undefined}
        className={cn(base, "h-11 pr-8", error ? "border-bad" : "border-line", className)}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-bad" role="alert">{error}</p>}
    </div>
  );
});

export function Field({
  label,
  hint,
  children,
  htmlFor,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  const fallback = useId();
  return (
    <div>
      <label htmlFor={htmlFor ?? fallback} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-bad">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
