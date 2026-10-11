import Link from "next/link";
import {
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Camera,
  Info,
} from "lucide-react";

export default function SampleReportPreview() {
  const photoPreviews = [
    {
      title: "Bathroom plumbing",
      desc: "Moisture near P-trap junction",
      status: "High Concern",
      statusColor: "text-rose-800 bg-rose-50 border-rose-200",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Balcony sliding track",
      desc: "Clear track & weather seal intact",
      status: "Passed",
      statusColor: "text-[#258653] bg-[#F0F6F2] border-[#DCE9DF]",
      imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Electrical panel",
      desc: "Circuit breakers & earthing clear",
      status: "Passed",
      statusColor: "text-[#258653] bg-[#F0F6F2] border-[#DCE9DF]",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="sample-report" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Inspection Deliverable
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            See exactly what you receive.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
            A clear, organized record of your property&apos;s condition, complete with supporting evidence and recommended next steps.
          </p>
        </div>

        {/* Polished Editorial Document-Style Card */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-[#E4DFD2] p-6 sm:p-10 lg:p-12 shadow-natural-lg max-w-5xl mx-auto">
          
          {/* Document Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E4DFD2] gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#12452E] block mb-1">
                GroundPulse Inspection Report
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#22231F]">
                Whitefield Apartment
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B63] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#12452E]" /> Whitefield, Bengaluru, Karnataka</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#12452E]" /> October 8, 2026</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F6F2] text-[#258653] border border-[#DCE9DF] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Inspection completed
              </span>
            </div>
          </div>

          {/* Overall Health & Checklist Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#E4DFD2] items-center">
            
            {/* Overall Health (Circular Progress) */}
            <div className="md:col-span-5 flex items-center gap-5 p-5 rounded-2xl bg-[#FAF8EF] border border-[#E4DFD2]">
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    className="stroke-[#E4DFD2]"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    className="stroke-[#12452E]"
                    strokeWidth="5"
                    strokeDasharray="157"
                    strokeDashoffset="25.1"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif font-bold text-xl text-[#12452E]">84</span>
                  <span className="text-[9px] text-[#6B6B63]">/100</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B63]">
                  Overall Health Score
                </span>
                <h4 className="font-serif font-bold text-lg text-[#22231F] mt-0.5">
                  Good Standing
                </h4>
                <p className="text-xs text-[#6B6B63]">
                  All critical life-safety checkpoints verified.
                </p>
              </div>
            </div>

            {/* Checklist Summary */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Checks Passed</span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#258653] block mt-1">
                  18
                </span>
                <span className="text-[11px] font-medium text-[#258653] flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Passed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Need Attention</span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#C58A2B] block mt-1">
                  3
                </span>
                <span className="text-[11px] font-medium text-[#C58A2B] flex items-center justify-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> Attention
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Action Needed</span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-rose-800 block mt-1">
                  1
                </span>
                <span className="text-[11px] font-medium text-rose-800 flex items-center justify-center gap-1 mt-0.5">
                  <XCircle className="w-3 h-3" /> Failed
                </span>
              </div>
            </div>

          </div>

          {/* Flagged Issue Callout */}
          <div className="py-8 border-b border-[#E4DFD2]">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9F5] border border-[#F2D7C8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#C58A2B] shrink-0" />
                  <span className="font-serif font-bold text-lg text-[#22231F]">
                    Bathroom water leakage
                  </span>
                </div>
                <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  Severity: High
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#6B6B63] leading-relaxed mb-4">
                Visible moisture around the bathroom P-trap connection. Further assessment and a repair estimate are recommended.
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-[#6B6B63] pt-3 border-t border-[#F2D7C8]/70">
                <span>Estimated repair cost:</span>
                <span className="text-[#22231F] font-semibold bg-white px-2 py-0.5 rounded border border-[#E4DFD2]">
                  Available after assessment
                </span>
              </div>
            </div>
          </div>

          {/* Photo Previews (3 items) */}
          <div className="py-8 border-b border-[#E4DFD2]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-lg text-[#22231F] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#12452E]" />
                Inspection Photo Evidence
              </h4>
              <span className="text-xs text-[#6B6B63]">Supporting records from visit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {photoPreviews.map((p, i) => (
                <div key={i} className="rounded-2xl border border-[#E4DFD2] bg-[#FAF8EF] overflow-hidden group">
                  <div className="h-36 relative overflow-hidden bg-slate-200">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h5 className="font-semibold text-xs sm:text-sm text-[#22231F]">{p.title}</h5>
                    <p className="text-[11px] text-[#6B6B63] mt-0.5 leading-snug">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspector Recommendation & CTA */}
          <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#12452E] block mb-1">
                Inspector Recommendation
              </span>
              <p className="text-sm text-[#22231F] italic leading-relaxed">
                &ldquo;Arrange a plumbing assessment to identify the source of the leak before approving repairs.&rdquo;
              </p>
              <span className="text-xs text-[#6B6B63] mt-1 block">
                * Note: Sample data shown above is for illustrative demonstration purposes.
              </span>
            </div>

            <Link
              href="/sample-report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white font-medium text-sm transition-all duration-200 shadow-sm shrink-0"
            >
              <span>View full sample report →</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
