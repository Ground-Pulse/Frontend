import {
  BadgeCheck,
  KeyRound,
  Video,
  PhoneCall,
  ThumbsUp,
  ShieldCheck,
} from "lucide-react";

export default function TrustSection() {
  const features = [
    {
      icon: BadgeCheck,
      title: "You know who's coming.",
      desc: "Meet your assigned inspector before the visit, with identity details and verification status.",
      highlight: false,
    },
    {
      icon: KeyRound,
      title: "Nobody enters without your OK.",
      desc: "Property access follows your approved instructions and access arrangements.",
      highlight: false,
    },
    {
      icon: Video,
      title: "Every room is documented.",
      desc: "Receive photo and video evidence of the areas included in your inspection.",
      highlight: false,
    },
    {
      icon: PhoneCall,
      title: "Watch remotely.",
      desc: "Coordinate with your inspector by phone or video call when available.",
      highlight: false,
    },
    {
      icon: ThumbsUp,
      title: "Nothing happens without your approval.",
      desc: "Review repair recommendations and estimated costs before authorizing any work.",
      highlight: false,
    },
    {
      icon: ShieldCheck,
      title: "Your property deserves care.",
      desc: "Clear documentation, accountable inspections, and transparent communication.",
      highlight: true, // 6th feature highlighted with light green background
    },
  ];

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Large White Rounded Rectangular Panel */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-[#E4DFD2] p-8 sm:p-12 lg:p-16 shadow-natural-lg">
          
          {/* Top Row: Heading and Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-12 sm:pb-16 border-b border-[#E4DFD2]">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
                Peace of Mind
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
                Why you can relax
              </h2>
            </div>
            
            <div className="lg:col-span-7 flex items-center">
              <p className="text-base sm:text-lg text-[#6B6B63] leading-relaxed">
                One verified person. Your approval before any repair. Photo and video evidence for every inspection. Clear reports, transparent costs, and complete control from anywhere.
              </p>
            </div>
          </div>

          {/* 3-Column by 2-Row Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-10 sm:pt-14">
            {features.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                    item.highlight
                      ? "bg-[#F0F6F2] border-[#DCE9DF]"
                      : "bg-white border-[#E4DFD2]/80 hover:border-[#E4DFD2] hover:shadow-natural"
                  }`}
                >
                  <div>
                    {/* Circular pale-green icon background */}
                    <div className="w-12 h-12 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center mb-5 shrink-0">
                      <IconComponent className="w-6 h-6 stroke-[1.75]" />
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#22231F] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#6B6B63] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
