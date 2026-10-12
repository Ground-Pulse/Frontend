"use client";

/**
 * Login page (PRD F-011: Role-Based Access).
 *
 * Stack used here, exactly as the PRD specifies:
 *  - React Hook Form  -> form state, no manual useState per field
 *  - Zod              -> the validation rules, written once as a schema
 *  - zodResolver      -> the bridge that lets RHF use that Zod schema
 *
 * The user picks a role (Owner / Inspector). After a valid submit we save a
 * demo session and send them to the matching dashboard. When my teammate's
 * NestJS /auth/login endpoint is ready, only onSubmit changes.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { saveSession } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Validation rules. Zod checks these before onSubmit ever runs. */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/** The TypeScript type is generated from the schema - no duplicate typing. */
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("OWNER");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginForm) {
    // Demo only: pretend the API checked the credentials.
    await new Promise((r) => setTimeout(r, 600));

    saveSession({
      name: role === "OWNER" ? "Priya Sharma" : "Ravi Kumar",
      email: data.email,
      role,
    });

    router.push(role === "OWNER" ? "/owner" : "/inspector");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8EF] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-2xl font-semibold">
            GroundPulse
          </Link>
          <p className="mt-2 text-sm text-[#6B6B63]">
            Log in to see your property dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4DFD2] bg-white p-7 shadow-[0_1px_2px_rgba(34,35,31,0.04)]">
          {/* Role switch - decides which dashboard opens after login */}
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-wide text-[#6B6B63]">
              I am an
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F3F0E5] p-1">
              {(["OWNER", "INSPECTOR"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "h-9 rounded-lg text-sm font-medium transition-colors",
                    role === r
                      ? "bg-[#12452E] text-[#FAF8EF]"
                      : "text-[#6B6B63] hover:text-[#22231F]"
                  )}
                >
                  {r === "OWNER" ? "Owner" : "Inspector"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Log in"}
            </Button>
          </form>

          <p className="mt-5 rounded-xl bg-[#F3F0E5] p-3 text-center text-xs text-[#6B6B63]">
            Demo login — any email and a 6+ character password works.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#6B6B63]">
          <Link href="/" className="underline hover:text-[#12452E]">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
