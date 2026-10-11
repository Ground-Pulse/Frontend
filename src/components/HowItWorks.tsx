"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  UserCheck,
  FileCheck2,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  ThumbsUp,
  X,
  Check,
} from "lucide-react";

export default function HowItWorks() {
  const [approvedState, setApprovedState] = useState<boolean | null>(null);

  const steps = [
    {
      step: "01",
      title: "Add your property",
      desc: "Enter the address, property type, and areas you want inspected.",
      preview: (
        <div className="bg-[#FAF8EF] p-4 rounded-xl border border-[#E4DFD2] text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#6B6B63]">
            <MapPin className="w-3.5 h-3.5 text-[#12452E]" />
            <span className="font-medium text-[#22231F]">Prestige Palms, Indiranagar</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-full bg-[#12452E] text-white text-[10px] font-medium">Apartment</span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-[#E4DFD2] text-[#6B6B63] text-[10px]">3 BHK</span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-[#E4DFD2] text-[#6B6B63] text-[10px]">Balcony</span>
          </div>
        </div>
      ),
    },
    {
      step: "02",
      title: "Schedule an inspection",
      desc: "Choose a suitable inspection slot and share any special instructions.",
      preview: (
        <div className="bg-[#FAF8EF] p-4 rounded-xl border border-[#E4DFD2] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B63] font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#12452E]" />
              Selected Date
            </span>
            <span className="font-semibold text-[#12452E]">Oct 18, 2026</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6B6B63]">
            <span>Slot: 10:30 AM IST</span>
            <span className="text-[#12452E] font-medium">Confirmed</span>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      title: "Meet your verified inspector",
      desc: "Your assigned inspector visits the property and follows the agreed checklist.",
      preview: (
        <div className="bg-[#FAF8EF] p-4 rounded-xl border border-[#E4DFD2] text-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#12452E] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[#22231F] truncate">Rajesh Kumar</div>
            <div className="text-[11px] text-[#12452E] flex items-center gap-1">
              <Shield className="w-3 h-3" /> Assigned Assessor #GP-409
            </div>
          </div>
        </div>
      ),
    },
    {
      step: "04",
      title: "Review your inspection report",
      desc: "See findings, photos, videos, issue severity, and recommendations in one place.",
      preview: (
        <div className="bg-[#FAF8EF] p-4 rounded-xl border border-[#E4DFD2] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-[#22231F]">Health Score</span>
            <span className="font-serif font-bold text-base text-[#12452E]">84/100</span>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="text-[#258653] font-medium">18 Passed</span>
            <span className="text-[#6B6B63]">•</span>
            <span className="text-[#C58A2B] font-medium">3 Attention</span>
            <span className="text-[#6B6B63]">•</span>
            <span className="text-rose-700 font-medium">1 Issue</span>
          </div>
        </div>
      ),
    },
    {
      step: "05",
      title: "Approve the next steps",
      desc: "Decide whether to proceed with recommended repairs or arrange another inspection.",
      preview: (
        <div className="bg-[#FAF8EF] p-3 rounded-xl border border-[#E4DFD2] text-xs space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-medium text-[#22231F]">Water leak in bath</span>
            <span className="text-[#C58A2B] font-semibold">Priority</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setApprovedState(true)}
              className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors ${
                approvedState === true
                  ? "bg-[#12452E] text-white"
                  : "bg-white border border-[#E4DFD2] text-[#12452E] hover:bg-[#DCE9DF]"
              }`}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setApprovedState(false)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                approvedState === false
                  ? "bg-rose-800 text-white"
                  : "bg-white border border-[#E4DFD2] text-[#6B6B63] hover:bg-[#F3F0E5]"
              }`}
            >
              Decline
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative px-3 sm:px-6 lg:px-8 py-16 md:py-24 bg-[#FAF8EF]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#12452E] block mb-2">
              Simple 5-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] leading-tight">
              Know your home the easy way
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B63] mt-3">
              Three simple steps. One clear report you can keep. No unnecessary trip home.
            </p>
          </div>

          <Link
            href="/book-inspection"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white font-medium text-sm transition-all duration-200 shadow-sm shrink-0"
          >
            <span>See all five steps →</span>
          </Link>
        </div>

        {/* 5 Step Cards with Real UI Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#E4DFD2] p-6 flex flex-col justify-between shadow-natural hover:shadow-natural-lg transition-all duration-300 group"
            >
              <div>
                {/* Step Number */}
                <div className="text-xs font-serif font-bold text-[#12452E] tracking-wider mb-4 px-2.5 py-1 rounded-full bg-[#DCE9DF]/60 inline-block">
                  STEP {item.step}
                </div>

                <h3 className="font-serif font-bold text-xl text-[#22231F] mb-2 leading-snug group-hover:text-[#12452E] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B6B63] leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Real UI Component Preview */}
              <div className="mt-auto pt-2">
                {item.preview}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
