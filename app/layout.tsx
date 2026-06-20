import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifePattern — Understand yourself through patterns",
  description: "A private personal insight platform that helps you discover what drains you, what energizes you, and what keeps repeating.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
