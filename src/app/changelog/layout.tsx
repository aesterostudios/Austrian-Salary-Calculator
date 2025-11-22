import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Austrian Salary Calculator",
  description:
    "Track the latest changes and improvements to the Austrian Salary Calculator. See our updates, bug fixes, and new features.",
  alternates: {
    canonical: "/changelog",
    languages: {
      en: "/changelog",
      de: "/changelog",
      "x-default": "/changelog",
    },
  },
  openGraph: {
    title: "Changelog | Austrian Salary Calculator",
    description:
      "Track the latest changes and improvements to the Austrian Salary Calculator.",
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
    title: "Changelog | Austrian Salary Calculator",
    description:
      "Track the latest changes and improvements to the Austrian Salary Calculator.",
    images: ["/opengraph-image.png"],
  },
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
