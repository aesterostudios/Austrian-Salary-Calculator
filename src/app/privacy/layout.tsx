import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | Austrian Salary Calculator",
  description:
    "Learn about our privacy practices. We respect your privacy - all calculations are performed locally in your browser with minimal data collection.",
  alternates: {
    canonical: "/privacy",
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
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Austrian Salary Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy policy | Austrian Salary Calculator",
    description:
      "Learn about our privacy practices. All calculations are performed locally in your browser with minimal data collection.",
    images: ["/opengraph-image.png"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
