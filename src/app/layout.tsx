import type { Metadata } from "next";
import Link from "next/link";
import {
  absoluteUrl,
  githubProfile,
  linkedinProfile,
  personName,
  professionalTitle,
  profileEmail,
  seoKeywords,
  siteDescription,
  siteName,
} from "./seo";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase makes every relative Open Graph, robots, and canonical URL
  // resolve to the production origin configured through NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(absoluteUrl("/")),
  applicationName: siteName,
  authors: [{ name: personName, url: absoluteUrl("/") }],
  creator: personName,
  publisher: personName,
  category: "technology",
  keywords: seoKeywords,
  title: {
    default: `${personName} | ${professionalTitle}`,
    template: `%s | ${personName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName,
    title: `${personName} | ${professionalTitle}`,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${personName} | ${professionalTitle}`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Add provider verification tokens here after claiming the site in Google
    // Search Console, Bing Webmaster Tools, and other search platforms.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-neutral-300 font-mono antialiased selection:bg-neutral-700">
        <nav
          aria-label="Primary navigation"
          className="max-w-4xl mx-auto px-8 pt-12 flex justify-between items-center text-xs uppercase tracking-widest text-neutral-500"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Base
          </Link>
          <div className="flex gap-6">
            <a
              href={githubProfile}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={linkedinProfile}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            {/* <a href={profileEmail} className="hover:text-white transition-colors">
              Communicate
            </a> */}
            <a
              href={profileEmail}
              className="hover:text-white transition-colors"
            >
              Contact Me
            </a>
          </div>
        </nav>

        {/* The children prop renders the route-specific page content. */}
        {children}
      </body>
    </html>
  );
}
