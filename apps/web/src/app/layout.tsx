import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { MockProvider } from "@/mocks/mock-provider";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
export const metadata: Metadata = {
  title: { default: "ROSA", template: "%s | ROSA" },
  description: "Medical instruments supplier and procurement partner."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <MockProvider>{children}</MockProvider>
      </body>
    </html>
  );
}
