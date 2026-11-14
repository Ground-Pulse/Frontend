import { ArrowRight, Building2, ClipboardCheck, Wrench } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

/** Onboarding step 1 — welcome & role selection (UX onboarding stack). */
const OPTIONS = [
  { role: "owner", title: "I own a property", desc: "Get verified inspections, photo reports and approve repairs remotely.", icon: Building2 },
  { role: "inspector", title: "I'm an inspector", desc: "Join as a verified inspector and complete digital checklists on-site.", icon: ClipboardCheck },
  { role: "provider", title: "I'm a service provider", desc: "Plumbers, electricians, locksmiths and cleaners — get repair jobs.", icon: Wrench },
];

export default function WelcomePage() {
  return (
    <AuthLayout title="Welcome to GroundPulse" subtitle="Tell us how you'll use GroundPulse and we'll set things up.">
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <Link
            key={o.role}
            href={`/register?role=${o.role}`}
            className="group flex items-center gap-4 rounded-2xl border border-[#E4DFD2] bg-white p-4 transition-colors hover:border-[#12452E]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCE9DF] text-[#12452E]">
              <o.icon className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{o.title}</span>
              <span className="block text-sm text-[#6B6B63]">{o.desc}</span>
            </span>
            <ArrowRight className="h-5 w-5 text-[#6B6B63] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-[#6B6B63]">
        Already have an account? <Link href="/login" className="font-semibold text-[#12452E] hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
