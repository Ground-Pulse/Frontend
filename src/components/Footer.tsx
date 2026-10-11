import Link from "next/link";
import { Home, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E4DFD2] bg-[#FAF8EF] text-[#6B6B63]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#E4DFD2]">
          
          {/* Left Column: Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
              aria-label="GroundPulse Home"
            >
              <div className="w-8 h-8 rounded-xl bg-[#12452E] text-white flex items-center justify-center shadow-sm">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-bold text-2xl text-[#12452E]">
                GroundPulse
              </span>
            </Link>

            <p className="text-sm text-[#6B6B63] max-w-sm leading-relaxed mb-6">
              Thoughtful property inspections for owners who cannot always be there in person.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#22231F]">
              <Mail className="w-4 h-4 text-[#12452E]" />
              <a
                href="mailto:support@groundpulse.in"
                className="hover:text-[#12452E] transition-colors font-medium"
              >
                support@groundpulse.in
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-bold text-sm text-[#22231F] tracking-wide mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/book-inspection" className="hover:text-[#12452E] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#12452E] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#12452E] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/sample-report" className="hover:text-[#12452E] transition-colors">
                  Sample report
                </Link>
              </li>
              <li>
                <Link href="/#inspector-verification" className="hover:text-[#12452E] transition-colors">
                  Company
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div className="lg:col-span-4">
            <h4 className="font-serif font-bold text-sm text-[#22231F] tracking-wide mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:support@groundpulse.in" className="hover:text-[#12452E] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#12452E] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#privacy-policy" className="hover:text-[#12452E] transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#12452E] transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6B63]">
          <p>© 2026 GroundPulse. All rights reserved.</p>
          <p className="text-[11px]">
            Bengaluru • Mumbai • Pune • Delhi NCR • Hyderabad • Goa
          </p>
        </div>

      </div>
    </footer>
  );
}
