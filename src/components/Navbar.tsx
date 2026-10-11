"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Home,
  Building2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8EF]/95 backdrop-blur-md border-b border-[#E4DFD2] shadow-[0_2px_12px_rgba(34,35,31,0.04)]"
          : "bg-[#FAF8EF] border-b border-[#E4DFD2]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on the left */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded-lg"
            aria-label="GroundPulse Homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-[#12452E] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0B3523] transition-colors">
              <div className="relative">
                <Home className="w-5 h-5 text-white" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#DCE9DF] ring-1 ring-[#12452E]" />
              </div>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-[#12452E]">
              GroundPulse
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-[#22231F]" aria-label="Main Navigation">
            <Link
              href="/"
              className="hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
                aria-expanded={servicesOpen}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180 text-[#12452E]" : "text-[#6B6B63]"}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E4DFD2] p-2 shadow-natural-lg">
                    <Link
                      href="/book-inspection?service=nri"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors"
                    >
                      <Home className="w-4 h-4 text-[#12452E] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#22231F]">NRI Property Guard</div>
                        <div className="text-xs text-[#6B6B63]">Routine checks for vacant Indian homes</div>
                      </div>
                    </Link>
                    <Link
                      href="/book-inspection?service=rental"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-[#12452E] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#22231F]">Rental Handover Audits</div>
                        <div className="text-xs text-[#6B6B63]">Move-in & move-out condition logs</div>
                      </div>
                    </Link>
                    <Link
                      href="/book-inspection?service=monsoon"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#12452E] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#22231F]">Seasonal Seepage Scans</div>
                        <div className="text-xs text-[#6B6B63]">Pre & post-monsoon dampness checks</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#how-it-works"
              className="hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
            >
              How it works
            </Link>

            <Link
              href="/#pricing"
              className="hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
            >
              Pricing
            </Link>

            <Link
              href="/sample-report"
              className="hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
            >
              Sample report
            </Link>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#12452E] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12452E] rounded"
                aria-expanded={companyOpen}
              >
                <span>Company</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyOpen ? "rotate-180 text-[#12452E]" : "text-[#6B6B63]"}`} />
              </button>

              {companyOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-[#E4DFD2] p-2 shadow-natural-lg">
                    <Link
                      href="/#inspector-verification"
                      className="block p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors text-sm font-medium text-[#22231F]"
                    >
                      Verification Standards
                    </Link>
                    <Link
                      href="/#faq"
                      className="block p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors text-sm font-medium text-[#22231F]"
                    >
                      Help & FAQ
                    </Link>
                    <a
                      href="mailto:support@groundpulse.in"
                      className="block p-2.5 rounded-xl hover:bg-[#F3F0E5]/60 transition-colors text-sm font-medium text-[#22231F]"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Primary CTA on the far right */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/book-inspection"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-[#22231F] bg-transparent border border-[#E4DFD2] hover:bg-[#12452E] hover:text-white hover:border-[#12452E] transition-all duration-200 shadow-sm active:scale-95"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/book-inspection"
              className="text-xs font-medium px-4 py-2 rounded-full text-white bg-[#12452E]"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#22231F] hover:bg-[#F3F0E5] focus:outline-none focus:ring-2 focus:ring-[#12452E]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4DFD2] bg-[#FAF8EF] px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium text-[#22231F]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              How it works
            </Link>
            <Link
              href="/#what-we-inspect"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              What we inspect
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              Pricing
            </Link>
            <Link
              href="/sample-report"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              Sample report
            </Link>
            <Link
              href="/#inspector-verification"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#E4DFD2]/40"
            >
              Verification Standards
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2"
            >
              FAQ
            </Link>

            <div className="pt-4">
              <Link
                href="/book-inspection"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-center block text-sm font-semibold text-white bg-[#12452E] shadow-sm hover:bg-[#0B3523]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
