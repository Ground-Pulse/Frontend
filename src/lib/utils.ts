import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely.
 * clsx      -> joins conditional classes
 * twMerge   -> removes conflicting Tailwind classes (e.g. "p-2 p-4" -> "p-4")
 * This is the same helper shadcn/ui uses in every component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
