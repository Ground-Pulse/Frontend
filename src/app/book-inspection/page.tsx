"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Home,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const initialAddress = searchParams.get("address") || "";
  const initialPlan = searchParams.get("plan") || "quarterly";

  const [propertyType, setPropertyType] = useState("apartment");
  const [city, setCity] = useState("bengaluru");
  const [plan, setPlan] = useState(initialPlan);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: initialAddress || "Prestige Palms, Indiranagar",
    ownerName: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    countryCode: "+91",
    phone: "9845012345",
    preferredDate: "2026-10-20",
    specialNotes: "Please verify master bathroom plumbing and exterior balcony door weather seals.",
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData((prev) => ({ ...prev, propertyName: initialAddress }));
    }
  }, [initialAddress]);

  const propertyTypes = [
    { id: "apartment", label: "Apartment / Flat", icon: Building2 },
    { id: "villa", label: "Independent Villa", icon: Home },
    { id: "commercial", label: "Office / Shop", icon: Building2 },
    { id: "plot", label: "Vacant Land / Plot", icon: MapPin },
  ];

  const cities = [
    { id: "bengaluru", name: "Bengaluru" },
    { id: "mumbai", name: "Mumbai & MMR" },
    { id: "pune", name: "Pune" },
    { id: "delhi-ncr", name: "Delhi NCR (Gurugram / Noida)" },
    { id: "hyderabad", name: "Hyderabad" },
    { id: "chennai", name: "Chennai" },
    { id: "goa", name: "Goa" },
  ];

  const plans = [
    {
      id: "one-time",
      name: "One-Time Inspection",
      price: "₹1,499",
      billing: "per visit",
      desc: "One thorough inspection with digital photo report",
    },
    {
      id: "quarterly",
      name: "Quarterly Plan",
      price: "₹3,999",
      billing: "per quarter",
      desc: "Scheduled quarterly checks throughout the year (Most popular)",
    },
    {
      id: "annual",
      name: "Annual Care Plan",
      price: "₹12,999",
      billing: "per year",
      desc: "Year-round oversight and regular property updates",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

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

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-[#22231F] hover:text-[#12452E] flex items-center gap-1.5 py-2 px-3.5 rounded-full border border-[#E4DFD2] bg-[#FAF8EF] hover:bg-[#F3F0E5] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {isSubmitted ? (
          /* Submission Screen */
          <div className="max-w-2xl mx-auto rounded-[32px] bg-white border border-[#E4DFD2] p-8 sm:p-12 text-center shadow-natural-lg">
            <div className="w-16 h-16 rounded-full bg-[#DCE9DF] text-[#12452E] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F6F2] text-[#258653] border border-[#DCE9DF] uppercase tracking-wider">
              Request Received
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22231F] mt-4 mb-3">
              We&apos;ve received your inspection request
            </h1>

            <p className="text-[#6B6B63] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Thank you, <strong className="text-[#22231F]">{formData.ownerName}</strong>. A member of our local coordinator team will review your property location in <strong className="text-[#12452E] capitalize">{city}</strong> and get in touch to confirm access arrangements.
            </p>

            <div className="p-5 rounded-2xl bg-[#FAF8EF] border border-[#E4DFD2] text-left text-xs sm:text-sm space-y-2.5 mb-8">
              <div className="flex justify-between">
                <span className="text-[#6B6B63]">Property Address:</span>
                <span className="font-semibold text-[#22231F] text-right truncate max-w-[240px]">{formData.propertyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B63]">Requested Plan:</span>
                <span className="font-semibold text-[#12452E] capitalize">{plan} Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B63]">Preferred Date:</span>
                <span className="font-semibold text-[#22231F]">{formData.preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B63]">Confirmation contact:</span>
                <span className="font-semibold text-[#22231F]">{formData.email}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sample-report"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white font-medium text-sm transition-all"
              >
                View sample report
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-3 rounded-full border border-[#E4DFD2] bg-white text-[#22231F] hover:bg-[#F3F0E5] text-sm font-medium transition-all"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#DCE9DF] text-[#12452E] uppercase tracking-wider">
                Schedule a Visit
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22231F] mt-3 mb-3">
                Book a property inspection
              </h1>
              <p className="text-sm sm:text-base text-[#6B6B63]">
                Share your property details and preferred schedule. We assign an available verified inspector and deliver your photo report within 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Columns (Left 8) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Property Type */}
                <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#E4DFD2] shadow-natural">
                  <h3 className="font-serif font-bold text-lg text-[#22231F] mb-4">
                    1. Property type
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {propertyTypes.map((t) => {
                      const Icon = t.icon;
                      const selected = propertyType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPropertyType(t.id)}
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                            selected
                              ? "border-[#12452E] bg-[#F0F6F2] text-[#12452E] ring-1 ring-[#12452E]"
                              : "border-[#E4DFD2] bg-white text-[#6B6B63] hover:border-[#22231F]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-semibold">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. City & Address */}
                <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#E4DFD2] shadow-natural space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#22231F]">
                    2. Location & address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                        Service City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-3 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                        Preferred Inspection Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-2.5 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                      Full Property Address / Society & Unit
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.propertyName}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                      placeholder="e.g. Prestige Palms, Unit 302, 12th Main, Indiranagar"
                      className="w-full bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-3 text-sm text-[#22231F] placeholder:text-[#6B6B63] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                    />
                  </div>
                </div>

                {/* 3. Choose Plan */}
                <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#E4DFD2] shadow-natural space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#22231F]">
                    3. Choose inspection package
                  </h3>

                  <div className="space-y-3">
                    {plans.map((p) => {
                      const selected = plan === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setPlan(p.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                            selected
                              ? "border-[#12452E] bg-[#F0F6F2] ring-1 ring-[#12452E]"
                              : "border-[#E4DFD2] bg-white hover:border-[#6B6B63]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected ? "border-[#12452E] bg-[#12452E]" : "border-[#E4DFD2]"}`}>
                              {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#22231F]">{p.name}</p>
                              <p className="text-xs text-[#6B6B63]">{p.desc}</p>
                            </div>
                          </div>
                          <span className="font-serif font-bold text-base text-[#12452E] shrink-0">
                            {p.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Owner Contact */}
                <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#E4DFD2] shadow-natural space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#22231F]">
                    4. Contact information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-2.5 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-2.5 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B6B63] mb-1.5 uppercase tracking-wide">
                      Phone Number (WhatsApp friendly)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3 py-2.5 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      >
                        <option value="+91">🇮🇳 +91 (India)</option>
                        <option value="+1">🇺🇸 +1 (USA / Canada)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+65">🇸🇬 +65 (Singapore)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex-1 bg-[#FAF8EF] border border-[#E4DFD2] rounded-xl px-3.5 py-2.5 text-sm text-[#22231F] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar Summary (Right 4) */}
              <div className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="bg-white rounded-[28px] border border-[#E4DFD2] p-6 sm:p-7 shadow-natural space-y-5">
                  <h3 className="font-serif font-bold text-lg text-[#22231F]">
                    Inspection Summary
                  </h3>

                  <div className="space-y-3 text-xs border-b border-[#E4DFD2] pb-5">
                    <div className="flex justify-between">
                      <span className="text-[#6B6B63]">Selected Plan:</span>
                      <span className="font-semibold text-[#22231F] capitalize">{plan} Plan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6B63]">City:</span>
                      <span className="font-semibold text-[#12452E] capitalize">{city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6B63]">Report Delivery:</span>
                      <span className="font-semibold text-[#22231F]">Within 48 hours</span>
                    </div>
                  </div>

                  <div className="py-2 border-b border-[#E4DFD2] flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#6B6B63]">Proposed Pricing:</span>
                    <span className="font-serif font-bold text-3xl text-[#12452E]">
                      {plan === "one-time" ? "₹1,499" : plan === "quarterly" ? "₹3,999" : "₹12,999"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#6B6B63]">
                    <div className="flex items-center gap-2 text-[#258653]">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Verified inspector assignment</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#258653]">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Owner approval before any repair</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full font-medium text-sm text-white bg-[#12452E] hover:bg-[#0B3523] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Request inspection visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-[#6B6B63] text-center leading-normal">
                    * Booking requests are confirmed based on local inspector availability.
                  </p>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DFD2] py-8 text-center text-xs text-[#6B6B63] bg-[#FAF8EF]">
        © 2026 GroundPulse • Thoughtful remote property care. Support: support@groundpulse.in
      </footer>
    </div>
  );
}

export default function BookInspectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8EF] flex items-center justify-center text-sm text-[#6B6B63]">Loading booking form...</div>}>
      <BookingContent />
    </Suspense>
  );
}
