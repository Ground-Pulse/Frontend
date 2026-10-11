import {
  Droplets,
  Zap,
  ShieldCheck,
  Bug,
  Sparkles,
  Waves,
  DoorOpen,
  House,
  Info,
} from "lucide-react";

export default function WhatWeInspect() {
  const categories = [
    {
      icon: Droplets,
      title: "Plumbing and water leakage",
      desc: "Visible leaks, taps, drainage, and water-related concerns.",
    },
    {
      icon: Zap,
      title: "Electrical safety",
      desc: "Visible wiring concerns, switches, sockets, and accessible electrical panels.",
    },
    {
      icon: ShieldCheck,
      title: "Security and locks",
      desc: "Doors, accessible locks, gates, and visible security concerns.",
    },
    {
      icon: Bug,
      title: "Pest indications",
      desc: "Visible signs of pests, droppings, and potential infestation.",
    },
    {
      icon: Sparkles,
      title: "Cleanliness and upkeep",
      desc: "General cleanliness, ventilation, and signs of neglected maintenance.",
    },
    {
      icon: Waves,
      title: "Seepage and dampness",
      desc: "Visible moisture, wall discoloration, and possible seepage.",
    },
    {
      icon: DoorOpen,
      title: "Windows and doors",
      desc: "Visible damage, alignment concerns, and opening or closing issues.",
    },
    {
      icon: House,
      title: "Visible structural concerns",
      desc: "Visible cracks, unusual surface damage, and areas requiring professional assessment.",
    },
  ];

  return (
    <section id="what-we-inspect" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Inspection Scope
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            Every important detail, checked.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
            From visible leaks to everyday upkeep, get a clearer picture of your property&apos;s condition.
          </p>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#E4DFD2] p-6 sm:p-7 shadow-natural hover:shadow-natural-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Pale-green icon circle */}
                  <div className="w-12 h-12 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center mb-5 shrink-0 group-hover:bg-[#12452E] group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#22231F] mb-2 leading-snug">
                    {cat.title}
                  </h3>

                  <p className="text-sm text-[#6B6B63] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Transparency Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white/70 border border-[#E4DFD2] flex items-start gap-3 text-xs sm:text-sm text-[#6B6B63] max-w-3xl">
          <Info className="w-4 h-4 text-[#12452E] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#22231F] font-semibold">Scope of service:</strong> Our inspections provide an organized visual and functional assessment of observable conditions. Visual inspections do not replace or substitute licensed electrical, structural engineering, or government statutory certifications.
          </p>
        </div>

      </div>
    </section>
  );
}
