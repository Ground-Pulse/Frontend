"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter your property address to continue.");
      return;
    }
    setError("");
    router.push(`/book-inspection?address=${encodeURIComponent(address.trim())}`);
  };

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 pt-2 pb-16">
      {/* 90-95% width container with large rounded corners */}
      <div className="relative mx-auto max-w-[1400px] min-h-[740px] md:min-h-[780px] rounded-[32px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16 text-white shadow-natural-lg">
        
        {/* Background Architectural Photography with warm/dark tone overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85')`,
          }}
          aria-hidden="true"
        />

        {/* Semi-transparent dark cinematic overlay ensuring text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />

        {/* Top/Center Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-6 sm:pt-10">
          
          {/* Translucent pill badge */}
          <Link
            href="/book-inspection"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-8 hover:bg-white/25 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#DCE9DF] animate-pulse" />
            <span>First 10 owners get a free inspection →</span>
          </Link>

          {/* Large Serif Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-3xl mb-6">
            Know your<br />
            home is fine.<br />
            From anywhere.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-[620px] font-normal leading-relaxed mb-10">
            A verified inspector checks your property, captures photos and videos, and sends you a detailed report. Approve repairs remotely, wherever you are.
          </p>

          {/* Horizontal Address Form */}
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-xl bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <div className="flex items-center gap-3 px-4 py-2 sm:py-0 flex-1">
              <MapPin className="w-5 h-5 text-[#12452E] shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your property address"
                className="w-full bg-transparent text-[#22231F] text-sm sm:text-base placeholder:text-[#6B6B63] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full bg-[#12452E] hover:bg-[#0B3523] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>Get an inspection →</span>
            </button>
          </form>

          {error && (
            <p className="text-xs text-rose-300 mt-2 bg-black/40 px-3 py-1 rounded-full">
              {error}
            </p>
          )}

          {/* Secondary Pill CTA */}
          <div className="mt-6">
            <Link
              href="/sample-report"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-white/95 text-xs sm:text-sm font-medium hover:bg-white/20 hover:border-white/50 transition-all"
            >
              <span>See a sample report →</span>
            </Link>
          </div>

        </div>

        {/* Bottom Bar: Trust Statements & Floating Property Status Card */}
        <div className="relative z-10 pt-12 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-white/15 mt-8">
          
          {/* Three Compact Trust Statements */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-white/85 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DCE9DF]" />
              Live in Bengaluru
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DCE9DF]" />
              Homes · Plots · Apartments
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DCE9DF]" />
              Your approval comes first
            </span>
          </div>

          {/* Floating Property Status Card (Bottom-Right) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-[#22231F] shadow-natural-lg border border-[#E4DFD2] w-full sm:w-auto sm:min-w-[290px] flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#12452E] block mb-0.5">
                Active Audit
              </span>
              <h3 className="font-serif font-bold text-base text-[#22231F] leading-tight">
                Ancestral Apartment
              </h3>
              <p className="text-xs text-[#6B6B63] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#12452E]" />
                Indiranagar, Bengaluru
              </p>
            </div>

            {/* Circular Green Progress Ring with Health Score 84 */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
                {/* Background Ring */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-[#E4DFD2]"
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Progress Ring (84%) */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-[#12452E]"
                  strokeWidth="4"
                  strokeDasharray="125.6"
                  strokeDashoffset="20.1"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif font-bold text-sm text-[#12452E]">84</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
