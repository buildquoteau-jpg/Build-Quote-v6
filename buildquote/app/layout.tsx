import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BuildQuote — Request for Quotation, Made Simple",
  description: "Upload your Bill of Materials and we'll turn it into a professional RFQ sent directly to your suppliers. Built for Southwest WA builders.",
  openGraph: {
    title: "BuildQuote — Request for Quotation, Made Simple",
    description: "Upload your Bill of Materials and we'll turn it into a professional RFQ sent directly to your suppliers.",
    url: "https://buildquote.com.au",
    siteName: "BuildQuote",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
