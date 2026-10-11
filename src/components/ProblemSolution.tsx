import {
  XCircle,
  CheckCircle2,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  Wrench,
  AlertOctagon,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function ProblemSolution() {
  const problems = [
    "Depending on distant relatives or reluctant friends who can't do deep checks",
    "Untrained caretakers who overlook hidden dampness, pipe decay, or pest nests",
    "Blurry WhatsApp photos sent with zero timeline, structure, or accountability",
    "Contractors overcharging or starting repairs without itemized cost approval",
  ];

  const solutions = [
    {
      icon: CalendarCheck,
      title: "Scheduled on Your Terms",
      desc: "Set one-time, quarterly, or seasonal inspections aligned with monsoon and lease transitions.",
      tag: "Zero hassle",
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: ClipboardList,
      title: "Standardized 22-Point Checklist",
      desc: "Inspectors follow a rigorous digital audit protocol covering locks, plumbing, seepage, and MCB panels.",
      tag: "Objective data",
      accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
    {
      icon: FileCheck2,
      title: "Media-Rich Digital Reports",
      desc: "Get GPS-stamped high-res photos, 360° videos, and health scores delivered directly to your portal.",
      tag: "48h delivery",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Wrench,
      title: "Transparent Remote Repair Approval",
      desc: "View vendor quotes with parts breakdown. Approve, modify, or decline any repair with a single tap.",
      tag: "Total control",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem → Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Living away should not mean losing visibility.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Whether you are 1,000 miles away in Dubai, Silicon Valley, London, or another Indian metro, your asset deserves professional oversight instead of guesswork.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: The Old Way (Problem) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-slate-950/80 border border-rose-900/30 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    The Fragile Status Quo
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Unstructured favors & stress
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Property owners repeatedly recount the same dread: relying on distant relatives, busy neighbors, or unvetted building watchmen. Small drips become structural mold, power cuts trip refrigerators, and repairs spiral out of control.
              </p>

              <div className="space-y-3.5">
                {problems.map((text, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-rose-900/20">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-950/40 flex items-center gap-3 text-xs text-rose-300/80">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Result: Anxiety, unexpected repair bills, and depreciating property value.</span>
            </div>
          </div>

          {/* Right: The GroundPulse Framework (Solution Cards) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                The GroundPulse Solution
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Institutional-grade property stewardship
              </h3>
            </div>

            {/* 4 Benefit Cards with icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solutions.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.accent} group-hover:scale-105 transition-transform`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified & Backed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
