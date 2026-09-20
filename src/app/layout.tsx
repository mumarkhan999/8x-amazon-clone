import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "amazon.clone",
  description: "A from-scratch Amazon-style storefront built for the 8x take-home.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="mt-12 bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-400">
            Built for the 8x take-home. Not affiliated with Amazon.com, Inc.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
