"use client";

/** Onboarding step 2 (owner) — add first property, then prompt to schedule. */
import { Building2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PropertyForm from "@/components/property/PropertyForm";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { useCreateProperty } from "@/hooks/useProperties";
import { errorMessage } from "@/lib/errors";
import { useAuthStore } from "@/stores/authStore";

export default function AddFirstPropertyPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const create = useCreateProperty();

  useEffect(() => {
    if (role && role !== "OWNER") router.replace("/");
  }, [role, router]);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <span className="flex items-center gap-2 font-serif text-xl font-semibold">
          <Building2 className="h-5 w-5 text-brand" /> GroundPulse
        </span>
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">Skip for now</Link>
      </div>
      <ol className="mb-6 flex items-center gap-2 text-xs font-medium" aria-label="Setup progress">
        <li className="flex items-center gap-1.5 text-ok"><Check className="h-4 w-4" /> Account</li>
        <li className="h-px flex-1 bg-line" aria-hidden />
        <li className="text-brand" aria-current="step">2 · Add property</li>
        <li className="h-px flex-1 bg-line" aria-hidden />
        <li className="text-muted">3 · First inspection</li>
      </ol>
      <h1 className="font-serif text-3xl font-semibold">Add your first property</h1>
      <p className="mt-2 text-sm text-muted">Address, type and a cover photo — that&apos;s all we need.</p>
      <Card className="mt-6">
        <PropertyForm
          submitLabel="Save & continue"
          pending={create.isPending}
          onSubmit={(v) =>
            create.mutate(v, {
              onSuccess: () => {
                toast.success("Property added", { description: "Next: schedule your first inspection." });
                router.push("/dashboard");
              },
              onError: (e) => toast.error("Couldn't save", { description: errorMessage(e) }),
            })
          }
        />
      </Card>
    </div>
  );
}
