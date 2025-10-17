import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Austrian Salary Calculator",
  description:
    "Estimate your Austrian net salary with our gross-to-net calculator (Brutto-Netto-Rechner).",
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
      </body>
    </html>
  );
}
