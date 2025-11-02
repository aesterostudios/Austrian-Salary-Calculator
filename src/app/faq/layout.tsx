import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Austrian Salary Calculator",
  description:
    "Answers to common questions about Austrian salary calculations, tax credits, family bonuses, social insurance, commuter allowances, and employment types.",
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Austrian Salary Calculator",
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
