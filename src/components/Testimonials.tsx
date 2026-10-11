import { Quote, MapPin } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      initials: "AR",
      name: "Ananya R.",
      role: "NRI homeowner",
      location: "Dubai",
      review:
        "Having a clear record of what was checked and seeing the photos made it much easier to stay informed about my apartment back home.",
    },
    {
      initials: "RM",
      name: "Rahul M.",
      role: "Property investor",
      location: "Bengaluru",
      review:
        "The structured report helps me keep track of maintenance issues without coordinating every small detail over multiple calls.",
    },
    {
      initials: "MS",
      name: "Meera S.",
      role: "Vacation-home owner",
      location: "Mysuru",
      review:
        "I like having the findings documented in one place. It makes it easier to understand what needs attention and decide what to do next.",
    },
  ];

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Owner Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            Peace of mind, wherever life takes you.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B63] mt-2 italic">
            * Demonstration experiences illustrative of typical property owner workflows.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] sm:rounded-[32px] border border-[#E4DFD2] p-8 flex flex-col justify-between shadow-natural hover:shadow-natural-lg transition-all duration-300"
            >
              <div>
                {/* Initials Avatar & Header */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#12452E] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#22231F] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#12452E] font-medium">{item.role}</p>
                    <p className="text-[11px] text-[#6B6B63] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#12452E]" /> {item.location}
                    </p>
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-sm sm:text-base text-[#22231F] leading-relaxed italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Decorative Subtle Accent */}
              <div className="pt-6 mt-6 border-t border-[#E4DFD2]/60 flex items-center justify-between text-xs text-[#6B6B63]">
                <span>Verified Inspection Workflow</span>
                <Quote className="w-4 h-4 text-[#DCE9DF]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
