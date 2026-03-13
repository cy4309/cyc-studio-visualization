import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { I18nProvider } from "@/locales/i18n";

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

export const metadata: Metadata = {
  title: "CYC Studio Visualization",
  description: "Visualizing CYC Studio's work with Next.js",
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
