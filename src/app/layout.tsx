import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#FAF8EF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "GroundPulse | Remote Property Inspections & Care",
  description:
    "Monitor your property from anywhere with verified local inspections, photo-backed reports, and owner-approved maintenance.",
  keywords: [
    "remote property inspection",
    "NRI property management India",
    "vacation home monitoring Bengaluru",
    "real estate maintenance India",
    "verified property inspectors",
    "digital inspection report",
  ],
  authors: [{ name: "GroundPulse" }],
  openGraph: {
    title: "GroundPulse | Remote Property Inspections & Care",
    description:
      "Know your home is fine. From anywhere. Verified local property inspections, digital checklists, and owner-approved maintenance.",
    type: "website",
    locale: "en_IN",
    siteName: "GroundPulse",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfairDisplay.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8EF] text-[#22231F] selection:bg-[#DCE9DF] selection:text-[#0B3523]">
        {/* Providers wraps the app in TanStack Query's QueryClientProvider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
