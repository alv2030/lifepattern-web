import type { Metadata } from "next";
import { Playfair_Display, Instrument_Serif, DM_Sans } from "next/font/google";
import { BackgroundOrbs } from "@/components/background-orbs";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LifePattern — Understand yourself through patterns",
  description: "A private personal insight platform that helps you discover what drains you, what energizes you, and what keeps repeating.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${instrumentSerif.variable} ${dmSans.variable}`}>
      <body>
        <BackgroundOrbs />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
