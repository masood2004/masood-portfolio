import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syed Masood Hussain | Systems Engineer",
  description: "Infrastructure, Intelligence, and System Architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-300 font-mono antialiased selection:bg-neutral-700">
        <nav className="max-w-4xl mx-auto px-8 pt-12 flex justify-between items-center text-xs uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-white transition-colors">
            Base
          </Link>
          <div className="flex gap-6">
            <a
              href="https://github.com/masood2004"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:hmasood3288@gmail.com"
              className="hover:text-white transition-colors"
            >
              Communicate
            </a>
          </div>
        </nav>

        {/* The children prop renders the specific page you are currently on */}
        {children}
      </body>
    </html>
  );
}
