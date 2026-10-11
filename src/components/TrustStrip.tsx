import { ShieldCheck, Video, Clock4, KeyRound } from "lucide-react";

export default function TrustStrip() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "Verified inspectors",
      desc: "Police verified, background-screened local property professionals.",
      badge: "100% Vetted",
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Video,
      title: "Photo & video evidence",
      desc: "High-resolution photos, 360° pan videos, and time-stamped proof.",
      badge: "Timestamped",
      accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
    {
      icon: Clock4,
      title: "Report within 48 hours",
      desc: "Full comprehensive digital condition scorecard sent to your dashboard.",
      badge: "Guaranteed SLA",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: KeyRound,
      title: "No repair without owner approval",
      desc: "Zero surprise bills. You inspect quotes and decide whether to proceed.",
      badge: "You Are in Control",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section className="relative py-8 border-y border-slate-800/80 bg-[#090f20]/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/80 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.accent} group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
