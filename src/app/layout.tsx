import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://klasim.vercel.app"),
  title: {
    default: "KLASIM - Standings Telemetry & Deterministic Scenario Modeler",
    template: "%s | KLASIM",
  },
  description:
    "Simulator klasemen esports deterministik & suite analitik meta Mobile Legends terlengkap (133 hero, build, counter pick, tier list, kalkulator duel).",
  keywords: [
    "Klasim",
    "MLBB Meta",
    "Mobile Legends Build",
    "Counter Pick MLBB",
    "Tier List MLBB",
    "Draft Simulator",
    "MPL ID",
    "PMWC",
    "VCT Pacific",
  ],
  authors: [{ name: "Klasim Team" }],
  creator: "Klasim",
  publisher: "Klasim",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://klasim.vercel.app",
    title: "KLASIM - Esports Telemetry & MLBB Meta Suite",
    description: "Simulator klasemen esports deterministik & suite analitik meta Mobile Legends terlengkap.",
    siteName: "KLASIM",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#05070c] text-slate-100 selection:bg-amber-400 selection:text-black">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
