import {
  ShieldCheck,
  UserCheck,
  MapPin,
  FileCheck2,
  CheckCircle2,
  Award,
  Sparkles,
  Info,
} from "lucide-react";

export default function InspectorVerification() {
  const standards = [
    {
      title: "Identity verification",
      desc: "Confirmed identity documents and authorized profile identification.",
    },
    {
      title: "Address verification where applicable",
      desc: "Documented residence records for local field inspectors.",
    },
    {
      title: "Reference checks",
      desc: "Prior professional experience and work integrity reviews.",
    },
    {
      title: "Background checks where legally and operationally supported",
      desc: "Standard screening protocols compliant with local operational norms.",
    },
    {
      title: "Supervised trial inspection",
      desc: "Hands-on checklist testing on mock properties before independent field visits.",
    },
    {
      title: "Ongoing performance review",
      desc: "Regular review of owner feedback, checklist completeness, and audit accuracy.",
    },
  ];

  return (
    <section id="inspector-verification" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Our Verification Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            People you can trust with your property.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
            Every visit should be transparent, documented, and handled with care.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Large Professional Property Inspection Photograph */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#E4DFD2] shadow-natural-lg aspect-[4/5] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85"
                alt="Professional property inspection in progress"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Bottom Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E4DFD2] text-[#22231F] shadow-natural">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#12452E]" />
                  <span className="font-serif font-bold text-sm">Assigned Field Assessor</span>
                </div>
                <p className="text-xs text-[#6B6B63]">
                  All inspections follow standard checklists and timestamped photo capture.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Verification Standards Checklist */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-2">
              <h3 className="font-serif font-bold text-2xl text-[#22231F]">
                What we verify before assigning an inspector
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B63] mt-1">
                Our proposed operational standards ensure every property visit is respectful, structured, and accountable.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {standards.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E4DFD2] p-4 sm:p-5 flex items-start gap-4 shadow-natural hover:shadow-natural-lg transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#22231F]">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6B6B63] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note on Operational Standards */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-[#E4DFD2] flex items-center gap-2.5 text-xs text-[#6B6B63]">
              <Info className="w-4 h-4 text-[#12452E] shrink-0" />
              <span>Proposed operational standards. Verification steps apply based on local regulatory frameworks.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
