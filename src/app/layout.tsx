import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { LanguageProvider } from "@/components/language-provider";
import {
  LANGUAGE_COOKIE_NAME,
  defaultLanguage,
  isLanguage,
} from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://austrian-salary-calculator.vercel.app'),
  title: {
    default: "Austrian Salary Calculator | Calculate Your Net Salary 2025",
    template: "%s | Austrian Salary Calculator",
  },
  description:
    "Calculate your Austrian net salary, taxes, and social insurance contributions with accurate 2025 rates. Supports gross-to-net and net-to-gross calculations, family bonuses, and special payments.",
  keywords: [
    "Austrian salary calculator",
    "net salary Austria",
    "gross to net Austria",
    "Austrian tax calculator",
    "Brutto Netto Rechner",
    "Gehaltsrechner Österreich",
    "13th salary Austria",
    "14th salary Austria",
    "social insurance Austria",
    "family bonus plus",
  ],
  authors: [{ name: "Austrian Salary Calculator" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["de_AT"],
    url: "/",
    siteName: "Austrian Salary Calculator",
    title: "Austrian Salary Calculator | Calculate Your Net Salary 2025",
    description:
      "Calculate your Austrian net salary with accurate 2025 tax rates. Supports gross-to-net, net-to-gross, family bonuses, and special payments.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Austrian Salary Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Austrian Salary Calculator | Calculate Your Net Salary 2025",
    description:
      "Calculate your Austrian net salary with accurate 2025 tax rates. Supports gross-to-net, net-to-gross, and special payments.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      de: "/",
      "x-default": "/",
    },
  },
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  const initialLanguage = isLanguage(cookieLanguage)
    ? cookieLanguage
    : defaultLanguage;

  return (
    <html lang={initialLanguage}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fff5f8] text-slate-900`}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
