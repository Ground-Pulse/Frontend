"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Which cities do you currently serve?",
      answer:
        "Service availability depends on your property's location and our verified inspector network. Enter your property address to check availability.",
    },
    {
      question: "How quickly will I receive the inspection report?",
      answer:
        "Our target is to deliver the inspection report within 48 hours of the visit. Timing may depend on the inspection and the availability of supporting information.",
    },
    {
      question: "Can I choose the inspector?",
      answer:
        "We assign an available inspector based on your property's location and requirements. You can review the available details and raise concerns before confirming the visit.",
    },
    {
      question: "What happens if an issue is found?",
      answer:
        "The report documents the issue, includes supporting evidence where available, and recommends the next step. Additional specialist assessment may be needed for certain problems.",
    },
    {
      question: "Do I have to approve repairs before they begin?",
      answer:
        "Yes. Repair work must not begin without your explicit approval of the proposed work and its cost.",
    },
    {
      question: "Can I schedule recurring inspections?",
      answer:
        "Yes. Recurring inspection plans can help you monitor your property over time, subject to service availability in your location.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
            Questions, answered.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
            Clear information about our inspections, report turnaround, and repair authorization.
          </p>
        </div>

        {/* Minimal Accordion List */}
        <div className="divide-y divide-[#E4DFD2] border-y border-[#E4DFD2]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-6 sm:py-7">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded-lg group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-serif font-bold text-lg sm:text-xl text-[#22231F] group-hover:text-[#12452E] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-[#12452E] text-white"
                        : "bg-white border border-[#E4DFD2] text-[#6B6B63]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="pt-4 text-sm sm:text-base text-[#6B6B63] leading-relaxed max-w-3xl animate-in fade-in duration-200"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
