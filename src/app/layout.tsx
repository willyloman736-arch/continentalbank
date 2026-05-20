import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "@/components/shared/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Continental Bank — Private Client Portal",
    template: "%s · Continental Bank",
  },
  description:
    "Continental Bank — discreet, institutional-grade private wealth management for a global client base. Multi-currency accounts, executive service, and bank-level oversight.",
  keywords: [
    "private banking",
    "wealth management",
    "Continental Bank",
    "multi-currency",
    "private client portal",
  ],
  authors: [{ name: "Continental Bank" }],
  openGraph: {
    title: "Continental Bank — Private Client Portal",
    description:
      "Institutional-grade private banking. Discreet. Established. Globally accessible.",
    type: "website",
    locale: "en_US",
    siteName: "Continental Bank",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#07111F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
