"use client";

/**
 * Login (React Hook Form + Zod). The role comes from the account, not from a
 * toggle — the backend issues a JWT with the user's role and the app routes to
 * that role's home.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLogin } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";
import { config } from "@/lib/config";
import { errorMessage } from "@/lib/errors";
import type { Role } from "@/lib/types";
import { ROLE_HOME, ROLE_LABEL, useAuthStore } from "@/stores/authStore";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

const DEMO: { role: Role; email: string; who: string }[] = [
  { role: "OWNER", email: "priya@example.com", who: "Priya · 2 properties" },
  { role: "INSPECTOR", email: "ravi@example.com", who: "Ravi · job today" },
  { role: "ADMIN", email: "admin@groundpulse.in", who: "Anita · admin" },
  { role: "PROVIDER", email: "imran@example.com", who: "Imran · electrician" },
];

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const login = useLogin();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const [error, setError] = useState<string | null>(null);

  // Already signed in → go home.
  useEffect(() => {
    if (hydrated && user && !login.isPending && !login.isSuccess) router.replace(ROLE_HOME[user.role]);
  }, [hydrated, user, router, login.isPending, login.isSuccess]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    setError(null);
    login.mutate(data, {
      onSuccess: (res) => {
        const home = ROLE_HOME[res.user.role];
        router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : home);
      },
      onError: (e) => setError(errorMessage(e, "Invalid email or password")),
    });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to see your properties, jobs or the admin console.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" error={errors.email?.message} {...register("email")} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••" error={errors.password?.message} {...register("password")} />
        </div>
        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6B63]">
        New to GroundPulse?{" "}
        <Link href="/onboarding/welcome" className="font-semibold text-[#12452E] hover:underline">Create an account</Link>
      </p>

      {config.useMockApi && (
        <div className="mt-8 rounded-2xl border border-dashed border-[#E4DFD2] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B63]">Demo accounts · password123</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => {
                  setValue("email", d.email, { shouldValidate: true });
                  setValue("password", "password123", { shouldValidate: true });
                }}
                className="rounded-xl border border-[#E4DFD2] bg-white px-3 py-2 text-left transition-colors hover:border-[#12452E]"
              >
                <span className="block text-sm font-medium">{ROLE_LABEL[d.role]}</span>
                <span className="block text-xs text-[#6B6B63]">{d.who}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
