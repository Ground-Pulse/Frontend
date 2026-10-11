import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import WhatWeInspect from "@/components/WhatWeInspect";
import SampleReportPreview from "@/components/SampleReportPreview";
import InspectorVerification from "@/components/InspectorVerification";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8EF] text-[#22231F] flex flex-col selection:bg-[#DCE9DF] selection:text-[#0B3523]">
      {/* 1. Minimal Sticky Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* 2. Architectural Luxury Villa Hero Section */}
        <HeroSection />

        {/* 3. Trust and Peace-of-Mind Section ("Why you can relax") */}
        <TrustSection />

        {/* 4. How It Works (5 Steps with Real UI Previews) */}
        <HowItWorks />

        {/* 5. What We Inspect (8 Categories Grid) */}
        <WhatWeInspect />

        {/* 6. Sample Inspection Report (Editorial Document Style) */}
        <SampleReportPreview />

        {/* 7. Inspector Verification Standards */}
        <InspectorVerification />

        {/* 8. Pricing Section (3 Transparent Plans) */}
        <PricingSection />

        {/* 9. Testimonials (Initials Avatars) */}
        <Testimonials />

        {/* 10. FAQ Section (6 Essential Questions) */}
        <FAQSection />

        {/* 11. Final CTA (Deep Forest-Green Panel) */}
        <FinalCTA />
      </main>

      {/* 12. Warm Cream Footer */}
      <Footer />
    </div>
  );
}
