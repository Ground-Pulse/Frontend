"use client";

/**
 * Sign up. Owners are active immediately and go to "Add your first property".
 * Inspectors and providers are created unverified and wait in the admin
 * verification queue before they can be assigned work.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, ClipboardCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import { useRegister } from "@/hooks/useAuth";
import { CITIES, SERVICE_TYPES } from "@/lib/checklist-templates";
import { errorMessage } from "@/lib/errors";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ROLE_HOME } from "@/stores/authStore";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(254),
    phone: z.string().trim().max(20).optional(),
    password: z.string().min(8, "Use at least 8 characters").regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
    role: z.enum(["OWNER", "INSPECTOR", "PROVIDER"]),
    serviceTypes: z.array(z.string()),
    locality: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" })
  .refine((v) => v.role !== "PROVIDER" || v.serviceTypes.length > 0, { path: ["serviceTypes"], message: "Pick at least one service" });
type Form = z.infer<typeof schema>;

const ROLES: { value: Exclude<Role, "ADMIN">; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "OWNER", label: "Property owner", desc: "Monitor my property remotely", icon: Building2 },
  { value: "INSPECTOR", label: "Inspector", desc: "Do on-site inspections", icon: ClipboardCheck },
  { value: "PROVIDER", label: "Service provider", desc: "Carry out repairs", icon: Wrench },
];

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role")?.toUpperCase() as Form["role"]) || "OWNER";
  const reg = useRegister();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      role: ["OWNER", "INSPECTOR", "PROVIDER"].includes(initialRole) ? initialRole : "OWNER",
      serviceTypes: [],
      locality: "Bengaluru",
    },
  });
  const role = watch("role");
  const services = watch("serviceTypes");

  const onSubmit = (v: Form) => {
    setError(null);
    reg.mutate(
      {
        name: v.name,
        email: v.email,
        password: v.password,
        role: v.role,
        phone: v.phone || undefined,
        ...(v.role === "PROVIDER" ? { serviceTypes: v.serviceTypes, locality: v.locality } : {}),
      },
      {
        onSuccess: (res) => router.push(res.user.role === "OWNER" ? "/onboarding/add-property" : ROLE_HOME[res.user.role]),
        onError: (e) => setError(errorMessage(e)),
      }
    );
  };

  return (
    <AuthLayout title="Create your account" subtitle="Takes under a minute.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <fieldset>
          <legend className="mb-2 text-sm font-medium">I am a…</legend>
          <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={role === r.value}
                onClick={() => setValue("role", r.value)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:flex-col sm:items-start sm:gap-1.5",
                  role === r.value ? "border-[#12452E] bg-[#DCE9DF]" : "border-[#E4DFD2] bg-white hover:border-[#12452E]/50"
                )}
              >
                <r.icon className="h-5 w-5 text-[#12452E]" />
                <span>
                  <span className="block text-sm font-semibold">{r.label}</span>
                  <span className="block text-xs text-[#6B6B63]">{r.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="r-name" className="mb-1.5 block text-sm font-medium">Full name</label>
          <Input id="r-name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="r-email" className="mb-1.5 block text-sm font-medium">Email</label>
            <Input id="r-email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          </div>
          <div>
            <label htmlFor="r-phone" className="mb-1.5 block text-sm font-medium">Phone <span className="font-normal text-[#6B6B63]">(optional)</span></label>
            <Input id="r-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" error={errors.phone?.message} {...register("phone")} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="r-pass" className="mb-1.5 block text-sm font-medium">Password</label>
            <Input id="r-pass" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
          </div>
          <div>
            <label htmlFor="r-confirm" className="mb-1.5 block text-sm font-medium">Confirm password</label>
            <Input id="r-confirm" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
          </div>
        </div>

        {role === "PROVIDER" && (
          <div className="space-y-4 rounded-2xl bg-[#F3F0E5] p-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Services you offer</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TYPES.map((s) => {
                  const on = services.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setValue("serviceTypes", on ? services.filter((x) => x !== s) : [...services, s], { shouldValidate: true })}
                      className={cn("h-9 rounded-full border px-3 text-sm", on ? "border-[#12452E] bg-[#12452E] text-white" : "border-[#E4DFD2] bg-white")}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {errors.serviceTypes && <p className="mt-1.5 text-xs text-[#C4554A]">{errors.serviceTypes.message}</p>}
            </fieldset>
            <div>
              <label htmlFor="r-loc" className="mb-1.5 block text-sm font-medium">Service area</label>
              <Select id="r-loc" {...register("locality")}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </div>
          </div>
        )}

        {role !== "OWNER" && (
          <p className="text-xs text-[#6B6B63]">Your account will be reviewed by our team before you can be assigned work.</p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={reg.isPending}>
          Create account
        </Button>
        <p className="text-center text-sm text-[#6B6B63]">
          Already have an account? <Link href="/login" className="font-semibold text-[#12452E] hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterInner />
    </Suspense>
  );
}
