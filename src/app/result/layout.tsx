import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculation Results | Austrian Salary Calculator",
  description:
    "View your detailed Austrian salary breakdown including net income, taxes, social insurance contributions, and special payments (13th and 14th salary).",
  alternates: {
    canonical: "/result",
    languages: {
      en: "/result",
      de: "/result",
      "x-default": "/result",
    },
  },
  openGraph: {
    title: "Salary Calculation Results | Austrian Salary Calculator",
    description:
      "View your detailed Austrian salary breakdown including net income, taxes, social insurance contributions, and special payments.",
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
    title: "Salary Calculation Results | Austrian Salary Calculator",
    description:
      "View your detailed Austrian salary breakdown including net income, taxes, social insurance contributions, and special payments.",
    images: ["/opengraph-image.png"],
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
