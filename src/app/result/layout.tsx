import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculation Results",
  description:
    "View your detailed Austrian salary breakdown including net income, taxes, social insurance contributions, and special payments (13th and 14th salary).",
  alternates: {
    languages: {
      en: "/result",
      de: "/result",
      "x-default": "/result",
    },
  },
  openGraph: {
    title: "Salary Calculation Results",
    description:
      "View your detailed Austrian salary breakdown including net income, taxes, social insurance contributions, and special payments.",
    type: "website",
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
