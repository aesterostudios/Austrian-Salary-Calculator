import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently asked questions | Austrian Salary Calculator",
  description:
    "Answers to common questions about Austrian salary calculations, tax credits, family bonuses, social insurance, commuter allowances, and employment types.",
  alternates: {
    canonical: "/faq",
    languages: {
      en: "/faq",
      de: "/faq",
      "x-default": "/faq",
    },
  },
  openGraph: {
    title: "Frequently asked questions | Austrian Salary Calculator",
    description:
      "Answers to common questions about Austrian salary calculations, tax credits, family bonuses, and social insurance.",
    type: "website",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
