import Link from "next/link";
import { ArrowRight, Eye, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Deep Forest-Green Panel with Large Rounded Corners */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#12452E] text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-natural-lg">
          
          {/* Subtle understated natural grain/texture background */}
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')`,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            
            {/* Small subtle badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#DCE9DF] text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Thoughtful Remote Property Stewardship</span>
            </div>

            {/* Serif Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
              Stop worrying about your property from afar.
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mb-10">
              Get a clearer picture of your property&apos;s condition with a verified inspection and a photo-backed report.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/book-inspection"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#12452E] hover:bg-[#FAF8EF] font-medium text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                <span>Book an inspection →</span>
              </Link>

              <Link
                href="/sample-report"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/30 hover:border-white text-white hover:bg-white/10 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>View sample report</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
