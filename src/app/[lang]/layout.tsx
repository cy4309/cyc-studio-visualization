import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/locales/i18n";
import type { Language } from "@/locales/i18n";
import { isValidLang, seoByLang } from "@/locales/seo";
import HtmlLangSync from "@/components/HtmlLangSync";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://cyc-studio-visualization.vercel.app";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isValidLang(raw)) return {};
  const lang = raw as Language;
  const seo = seoByLang[lang];
  const canonical = `${siteUrl.replace(/\/$/, "")}/${lang}`;

  return {
    title: {
      default: seo.title,
      template: "%s | CYC Studio",
    },
    description: seo.description,
    keywords:
      lang === "zh"
        ? [
            "CYC Studio",
            "網頁設計",
            "互動網站",
            "WebAR",
            "前端開發",
            "動態設計",
          ]
        : [
            "CYC Studio",
            "creative web studio",
            "interactive design",
            "WebAR",
            "frontend development",
            "motion design",
          ],
    alternates: {
      canonical,
      languages: {
        "zh-TW": `${siteUrl.replace(/\/$/, "")}/zh`,
        en: `${siteUrl.replace(/\/$/, "")}/en`,
        "x-default": `${siteUrl.replace(/\/$/, "")}/zh`,
      },
    },
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      alternateLocale: lang === "zh" ? ["en_US"] : ["zh_TW"],
      url: canonical,
      siteName: "CYC Studio",
      title: seo.title,
      description: seo.description,
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
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: raw } = await params;
  if (!isValidLang(raw)) notFound();

  return (
    <I18nProvider defaultLang={raw as Language}>
      <HtmlLangSync />
      {children}
    </I18nProvider>
  );
}
