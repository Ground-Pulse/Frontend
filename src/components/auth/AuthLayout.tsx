import { Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

/** Split layout for login / register / onboarding (editorial brand panel + form). */
export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF8EF] text-[#22231F]">
      <aside className="relative hidden w-[44%] overflow-hidden bg-[#12452E] text-[#FAF8EF] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold">
            <Building2 className="h-6 w-6" /> GroundPulse
          </Link>
          <div>
            <p className="font-serif text-4xl leading-tight">“See your property&apos;s true condition, anywhere in the world.”</p>
            <ul className="mt-8 space-y-3 text-sm text-[#DCE9DF]">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verified inspectors and providers only</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Photo-backed reports within 48 hours</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> No repair without your approval</li>
            </ul>
          </div>
          <p className="text-xs text-[#DCE9DF]/70">© GroundPulse · Remote property care</p>
        </div>
      </aside>
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-serif text-2xl font-semibold text-[#12452E] lg:hidden">
            <Building2 className="h-6 w-6" /> GroundPulse
          </Link>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[#6B6B63]">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
