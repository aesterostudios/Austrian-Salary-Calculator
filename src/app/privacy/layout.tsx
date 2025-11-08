import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | Austrian Salary Calculator",
  description:
    "Learn about our privacy practices. We respect your privacy - all calculations are performed locally in your browser with minimal data collection.",
  alternates: {
    languages: {
      en: "/privacy",
      de: "/privacy",
      "x-default": "/privacy",
    },
  },
  openGraph: {
    title: "Privacy policy | Austrian Salary Calculator",
    description:
      "Learn about our privacy practices. All calculations are performed locally in your browser with minimal data collection.",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
