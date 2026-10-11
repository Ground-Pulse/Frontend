"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Camera,
  ArrowLeft,
  Check,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

export default function SampleReportPage() {
  const [filter, setFilter] = useState<"all" | "passed" | "attention" | "failed">("all");
  const [assessmentStatus, setAssessmentStatus] = useState<"pending" | "approved" | "declined">("pending");

  const checklistItems = [
    {
      category: "Plumbing",
      title: "Master Bathroom Diverter & P-Trap",
      status: "failed",
      location: "Master Ensuite",
      notes: "Visible moisture around the bathroom P-trap connection. Plumber assessment recommended.",
      photo: "IMG_01",
    },
    {
      category: "Plumbing",
      title: "Kitchen Sink Trap & Drain Hose",
      status: "passed",
      location: "Kitchen Utility",
      notes: "No leaks under sink basin. Drainage stack flowing clearly without blockage.",
      photo: "IMG_04",
    },
    {
      category: "Plumbing",
      title: "Geyser Pressure Valve & Braided Inlet",
      status: "attention",
      location: "Guest Bathroom",
      notes: "Minor calcium scale buildup on braided hose nut. Keep monitored.",
      photo: "IMG_05",
    },
    {
      category: "Electrical",
      title: "Main DB Panel & Circuit Breakers",
      status: "passed",
      location: "Entrance Foyer",
      notes: "Residual current breaker tripped successfully at test. Wiring neatly organized.",
      photo: "IMG_03",
    },
    {
      category: "Electrical",
      title: "Balcony Utility Socket Weather Cover",
      status: "attention",
      location: "South Balcony",
      notes: "Spring latch on IP65 weather flap is slightly stiff. Flap closes with gentle pressure.",
      photo: "IMG_07",
    },
    {
      category: "Security & Locks",
      title: "Main Door Digital Smart Lock & Deadbolt",
      status: "passed",
      location: "Main Entrance",
      notes: "Battery level tested adequate. Mechanical backup key latch operating smoothly.",
      photo: "IMG_08",
    },
    {
      category: "Security & Locks",
      title: "Balcony Sliding Window Latches & Grills",
      status: "passed",
      location: "South Balcony",
      notes: "Anchor bolts securely set. Powder coating intact with zero visible rust.",
      photo: "IMG_02",
    },
    {
      category: "Seepage & Dampness",
      title: "Bedroom 2 North Wall Surface Check",
      status: "attention",
      location: "Bedroom 2",
      notes: "Minor surface paint discoloration near skirting board. Monitor quarterly.",
      photo: "IMG_09",
    },
    {
      category: "Pest Indications",
      title: "Skirting Boards & Cabinet Cavities",
      status: "passed",
      location: "Entire Flat",
      notes: "No visible termite mud tubes, rodent droppings, or wood borer dust found.",
      photo: "IMG_10",
    },
    {
      category: "Windows & Ventilation",
      title: "Exhaust Fans & Kitchen Chimney Duct Mesh",
      status: "passed",
      location: "Kitchen & Baths",
      notes: "Exterior bird mesh undamaged. Louvers close shut to prevent rain ingress.",
      photo: "IMG_11",
    },
    {
      category: "Visible Structural Concerns",
      title: "Floor Tile Hollow Sound Test & Plaster",
      status: "passed",
      location: "Living & Bedrooms",
      notes: "Visual and tap test confirmed zero debonded tiles across the flat.",
      photo: "IMG_12",
    },
  ];

  const filteredItems = checklistItems.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#FAF8EF] text-[#22231F] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#E4DFD2] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#12452E] text-white flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-2xl text-[#12452E]">
              GroundPulse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-[#22231F] hover:text-[#12452E] flex items-center gap-1.5 py-2 px-3.5 rounded-full border border-[#E4DFD2] bg-[#FAF8EF] hover:bg-[#F3F0E5] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>

            <Link
              href="/book-inspection"
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white bg-[#12452E] hover:bg-[#0B3523] shadow-sm transition-all"
            >
              Book an inspection
            </Link>
          </div>
        </div>
      </header>

      {/* Main Report Document */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Illustrative Demo Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] flex items-center justify-between gap-4 text-xs sm:text-sm text-[#6B6B63] shadow-natural">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#12452E] shrink-0" />
            <span>This is an illustrative sample report demonstrating our format and findings documentation.</span>
          </div>
          <button
            type="button"
            onClick={() => alert("Downloading PDF summary certificate...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E4DFD2] bg-[#FAF8EF] hover:bg-[#F3F0E5] text-xs font-semibold text-[#22231F] shrink-0 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#12452E]" />
            <span>Download Sample PDF</span>
          </button>
        </div>

        {/* Report Card Document Header */}
        <div className="bg-white rounded-[32px] border border-[#E4DFD2] p-8 sm:p-12 shadow-natural-lg space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E4DFD2] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#12452E] block mb-1">
                Official Digital Inspection Record
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#22231F]">
                Whitefield Apartment
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6B63] mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#12452E]" /> Whitefield, Bengaluru, Karnataka</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#12452E]" /> October 8, 2026</span>
                <span>•</span>
                <span className="text-[#258653] font-semibold">Verified Field Visit</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F0F6F2] text-[#258653] border border-[#DCE9DF] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Inspection completed
              </span>
            </div>
          </div>

          {/* Health Score & 3-Metric Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
            
            {/* Score Ring */}
            <div className="md:col-span-5 flex items-center gap-5 p-6 rounded-2xl bg-[#FAF8EF] border border-[#E4DFD2]">
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
                  Property Health Score
                </span>
                <h4 className="font-serif font-bold text-xl text-[#22231F] mt-0.5">
                  Good Standing
                </h4>
                <p className="text-xs text-[#6B6B63] mt-0.5">
                  18 checkpoints verified in working order.
                </p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Checks Passed</span>
                <span className="font-serif font-bold text-3xl text-[#258653] block mt-1">18</span>
                <span className="text-[11px] font-medium text-[#258653]">Normal</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Need Attention</span>
                <span className="font-serif font-bold text-3xl text-[#C58A2B] block mt-1">3</span>
                <span className="text-[11px] font-medium text-[#C58A2B]">Monitor</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E4DFD2] text-center">
                <span className="text-xs text-[#6B6B63] block">Action Needed</span>
                <span className="font-serif font-bold text-3xl text-rose-800 block mt-1">1</span>
                <span className="text-[11px] font-medium text-rose-800">High severity</span>
              </div>
            </div>

          </div>

          {/* Flagged Issue Section */}
          <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F2D7C8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#C58A2B] shrink-0" />
                <h3 className="font-serif font-bold text-xl text-[#22231F]">
                  Bathroom water leakage
                </h3>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                Severity: High
              </span>
            </div>

            <p className="text-sm text-[#6B6B63] leading-relaxed">
              Visible moisture around the bathroom P-trap connection. Further assessment and a repair estimate are recommended.
            </p>

            <div className="pt-3 border-t border-[#F2D7C8]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#6B6B63]">
                Estimated repair cost: <strong className="text-[#22231F] font-semibold">Available after assessment</strong>
              </div>

              {/* Owner Action Buttons */}
              <div className="flex items-center gap-3">
                {assessmentStatus === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setAssessmentStatus("approved")}
                      className="px-5 py-2 rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white text-xs font-medium shadow-sm transition-all"
                    >
                      Authorize Plumber Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssessmentStatus("declined")}
                      className="px-4 py-2 rounded-full bg-white border border-[#E4DFD2] hover:bg-[#F3F0E5] text-xs font-medium text-[#6B6B63] transition-all"
                    >
                      Decline for now
                    </button>
                  </>
                )}

                {assessmentStatus === "approved" && (
                  <span className="text-xs font-semibold text-[#258653] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Assessment authorized by owner. Coordinator notified.
                  </span>
                )}

                {assessmentStatus === "declined" && (
                  <span className="text-xs font-semibold text-[#6B6B63]">
                    Declined. Noted for next quarterly review.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Photo Previews */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-xl text-[#22231F] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#12452E]" />
              Inspection Photos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E4DFD2] bg-[#FAF8EF] overflow-hidden">
                <div className="h-44 relative bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                    alt="Bathroom plumbing"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200">
                    High Concern
                  </span>
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-sm text-[#22231F]">Bathroom plumbing</h5>
                  <p className="text-xs text-[#6B6B63] mt-1">Visible moisture near P-trap junction</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4DFD2] bg-[#FAF8EF] overflow-hidden">
                <div className="h-44 relative bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"
                    alt="Balcony sliding track"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#258653] bg-[#F0F6F2] border border-[#DCE9DF]">
                    Passed
                  </span>
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-sm text-[#22231F]">Balcony sliding track</h5>
                  <p className="text-xs text-[#6B6B63] mt-1">Clean track & weather seal intact</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4DFD2] bg-[#FAF8EF] overflow-hidden">
                <div className="h-44 relative bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                    alt="Electrical panel"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#258653] bg-[#F0F6F2] border border-[#DCE9DF]">
                    Passed
                  </span>
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-sm text-[#22231F]">Electrical panel</h5>
                  <p className="text-xs text-[#6B6B63] mt-1">Circuit breakers & earthing clear</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Recommendation */}
          <div className="p-6 rounded-2xl bg-[#FAF8EF] border border-[#E4DFD2]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#12452E] block mb-1">
              Inspector Recommendation
            </span>
            <p className="font-serif text-base sm:text-lg text-[#22231F] italic leading-relaxed">
              &ldquo;Arrange a plumbing assessment to identify the source of the leak before approving repairs.&rdquo;
            </p>
          </div>

          {/* Detailed 22-Checklist Log */}
          <div className="space-y-4 pt-4 border-t border-[#E4DFD2]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-xl text-[#22231F]">
                  Inspection Checkpoints Log
                </h4>
                <p className="text-xs text-[#6B6B63]">
                  All examined items grouped with status notes
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                    filter === "all"
                      ? "bg-[#12452E] text-white"
                      : "bg-[#FAF8EF] border border-[#E4DFD2] text-[#6B6B63] hover:text-[#22231F]"
                  }`}
                >
                  All ({checklistItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("passed")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                    filter === "passed"
                      ? "bg-[#258653] text-white"
                      : "bg-[#FAF8EF] border border-[#E4DFD2] text-[#6B6B63]"
                  }`}
                >
                  Passed (7)
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("attention")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                    filter === "attention"
                      ? "bg-[#C58A2B] text-white"
                      : "bg-[#FAF8EF] border border-[#E4DFD2] text-[#6B6B63]"
                  }`}
                >
                  Attention (3)
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("failed")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                    filter === "failed"
                      ? "bg-rose-800 text-white"
                      : "bg-[#FAF8EF] border border-[#E4DFD2] text-[#6B6B63]"
                  }`}
                >
                  Failed (1)
                </button>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2.5">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF8EF] border border-[#E4DFD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    {item.status === "passed" && (
                      <CheckCircle2 className="w-4 h-4 text-[#258653] shrink-0 mt-0.5" />
                    )}
                    {item.status === "attention" && (
                      <AlertCircle className="w-4 h-4 text-[#C58A2B] shrink-0 mt-0.5" />
                    )}
                    {item.status === "failed" && (
                      <XCircle className="w-4 h-4 text-rose-800 shrink-0 mt-0.5" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#22231F] text-sm">{item.title}</span>
                        <span className="text-[10px] text-[#6B6B63] px-2 py-0.5 rounded bg-white border border-[#E4DFD2]">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B63] mt-1">{item.notes}</p>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      item.status === "passed"
                        ? "bg-[#F0F6F2] text-[#258653] border border-[#DCE9DF]"
                        : item.status === "attention"
                        ? "bg-[#FFF9F0] text-[#C58A2B] border border-[#F2DEB0]"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-8 border-t border-[#E4DFD2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B6B63]">
              Ready to have your property inspected with this level of clarity?
            </p>
            <Link
              href="/book-inspection"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white text-xs sm:text-sm font-medium transition-all"
            >
              <span>Book an inspection →</span>
            </Link>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DFD2] py-8 text-center text-xs text-[#6B6B63] bg-[#FAF8EF]">
        © 2026 GroundPulse • Thoughtful remote property care. Support: support@groundpulse.in
      </footer>
    </div>
  );
}
