import Link from "next/link";
import { Check, Info, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      id: "one-time",
      name: "One-Time Inspection",
      price: "₹1,499",
      billing: "Per visit",
      desc: "For a single, thorough baseline inspection of your property.",
      popular: false,
      features: [
        "One property inspection",
        "Digital inspection checklist",
        "Photo-backed report",
        "Issue flagging",
        "Repair recommendations",
        "Standard support",
      ],
      bg: "bg-white",
      border: "border-[#E4DFD2]",
      buttonBg: "bg-transparent border border-[#E4DFD2] text-[#22231F] hover:bg-[#12452E] hover:text-white hover:border-[#12452E]",
    },
    {
      id: "quarterly",
      name: "Quarterly Plan",
      price: "₹3,999",
      billing: "Per quarter",
      desc: "Scheduled checkups throughout the year to catch issues early.",
      popular: true,
      features: [
        "Scheduled quarterly inspections",
        "Digital inspection checklist",
        "Photo and video report",
        "Issue tracking",
        "Repair coordination, subject to availability",
        "Priority support",
      ],
      bg: "bg-[#F0F6F2]",
      border: "border-[#DCE9DF] ring-1 ring-[#12452E]/20",
      buttonBg: "bg-[#12452E] text-white hover:bg-[#0B3523]",
    },
    {
      id: "annual",
      name: "Annual Care Plan",
      price: "₹12,999",
      billing: "Per year",
      desc: "Year-round oversight for owners who want continuous peace of mind.",
      popular: false,
      features: [
        "Recurring inspections throughout the year",
        "Digital inspection checklist",
        "Photo and video reports",
        "Inspection history",
        "Repair coordination, subject to availability",
        "Priority support",
      ],
      bg: "bg-white",
      border: "border-[#E4DFD2]",
      buttonBg: "bg-transparent border border-[#E4DFD2] text-[#22231F] hover:bg-[#12452E] hover:text-white hover:border-[#12452E]",
    },
  ];

  return (
    <section id="pricing" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            Property care that fits your needs.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
            Choose a one-time inspection or a recurring plan that keeps you informed throughout the year.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-[28px] sm:rounded-[36px] ${plan.bg} ${plan.border} p-8 sm:p-10 flex flex-col justify-between shadow-natural transition-all duration-300 relative`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-[#12452E] text-white text-xs font-medium tracking-wide shadow-sm">
                  Most popular
                </div>
              )}

              <div>
                <h3 className="font-serif font-bold text-2xl text-[#22231F]">
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6B63] mt-1.5 leading-snug">
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1 my-6 pt-2 border-t border-[#E4DFD2]/60">
                  <span className="font-serif font-bold text-4xl sm:text-5xl text-[#22231F]">
                    {plan.price}
                  </span>
                  <span className="text-xs sm:text-sm text-[#6B6B63] ml-1 font-medium">
                    / {plan.billing}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-6 border-t border-[#E4DFD2]/60 mb-8">
                  <span className="text-xs font-semibold text-[#22231F] uppercase tracking-wider block mb-3">
                    What&apos;s included:
                  </span>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#22231F]">
                      <div className="w-4 h-4 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card CTA button */}
              <div>
                <Link
                  href={`/book-inspection?plan=${plan.id}`}
                  className={`w-full py-3.5 px-6 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${plan.buttonBg}`}
                >
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Mandatory Note */}
        <div className="mt-12 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white border border-[#E4DFD2] flex items-center gap-3.5 shadow-natural text-center sm:text-left">
          <div className="w-9 h-9 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-[#22231F]">
            <strong className="font-semibold text-[#12452E]">Owner Approval Guarantee:</strong> Repair costs are always presented for owner approval before work is assigned.
          </p>
        </div>

      </div>
    </section>
  );
}
