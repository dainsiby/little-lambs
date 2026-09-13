import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Lambs | A little book for growing hearts & minds",
  description: "Stories, prayers and playful activities for ages 4–10. Discover the Little Lambs Christian activity book series.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
