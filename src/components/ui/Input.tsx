import { cn } from "@/lib/utils";

/**
 * Text input used by the login form.
 * React Hook Form passes its {...register("email")} props straight through,
 * which is why we forward every native input prop with {...props}.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-colors",
          "placeholder:text-[#A5A399] focus:border-[#12452E]",
          error ? "border-[#C4554A]" : "border-[#E4DFD2]",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#C4554A]">{error}</p>}
    </div>
  );
}
