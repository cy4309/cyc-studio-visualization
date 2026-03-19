import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { I18nProvider } from "@/locales/i18n";
import JsonLd from "@/components/JsonLd";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://cyc-studio-visualization.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "CYC Studio | Creative Web Studio - Interactive Visual Experiences",
    template: "%s | CYC Studio",
  },
  description:
    "CYC Studio is a creative web studio focused on interactive visual experiences, spanning frontend design, motion interaction, data integration, and system implementation. We build digital work that balances aesthetics and practical functionality.",
  keywords: [
    "CYC Studio",
    "creative web studio",
    "interactive design",
    "WebAR",
    "3D experiences",
    "generative AI",
    "frontend development",
    "motion design",
  ],
  authors: [{ name: "CYC Studio", url: siteUrl }],
  creator: "CYC Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_TW"],
    url: siteUrl,
    siteName: "CYC Studio",
    title: "CYC Studio | Creative Web Studio - Interactive Visual Experiences",
    description:
      "CYC Studio is a creative web studio focused on interactive visual experiences. We build digital work that balances aesthetics and practical functionality.",
    images: [
      {
        url: "/cyc-logo.png",
        width: 512,
        height: 512,
        alt: "CYC Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CYC Studio | Creative Web Studio",
    description:
      "CYC Studio is a creative web studio focused on interactive visual experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-inter">
        <JsonLd />
        <I18nProvider>
          <SmoothScroll>
            <div className="noise-overlay" />
            {children}
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
