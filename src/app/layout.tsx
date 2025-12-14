import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://readme.leolaborie.com"),
  title: "README Generator - AI-Powered Documentation for GitHub Repositories",
  description:
    "Generate professional README.md files for your GitHub repositories using AI. Analyze your codebase and create comprehensive documentation in seconds.",
  keywords: [
    "readme generator",
    "github readme",
    "documentation",
    "ai",
    "markdown",
    "github",
    "readme.md",
    "developer tools",
  ],
  authors: [{ name: "Leo Laborie", url: "https://leolaborie.com" }],
  creator: "Leo Laborie",
  publisher: "Leo Laborie",
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
  alternates: {
    canonical: "https://readme.leolaborie.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readme.leolaborie.com",
    siteName: "README Generator",
    title: "README Generator - AI-Powered Documentation",
    description:
      "Generate professional README.md files for your GitHub repositories using AI. Create comprehensive documentation in seconds.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "README Generator Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "README Generator - AI-Powered Documentation",
    description:
      "Generate professional README.md files for your GitHub repositories using AI.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
