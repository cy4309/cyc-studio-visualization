/**
 * JSON-LD 結構化資料元件
 *
 * 什麼是 JSON-LD？
 * - JSON-LD (JavaScript Object Notation for Linked Data) 是一種在網頁中嵌入結構化資料的方式
 * - 搜尋引擎（如 Google）會讀取這些資料，用來理解頁面內容、顯示「豐富搜尋結果」(Rich Results)
 *
 * 常見用途：
 * - Organization：公司/工作室資訊，可在搜尋結果顯示 logo、聯絡方式
 * - WebSite：網站整體資訊，可啟用站內搜尋框
 * - Person：個人/創辦人資訊
 *
 * 本專案使用 Organization + WebSite 組合，讓 Google 能識別 CYC Studio 的：
 * - 名稱、描述、網址
 * - Logo
 * - 聯絡方式（email）
 *
 * 驗證方式：使用 Google 的 Rich Results Test 或 Schema Markup Validator
 * @see https://search.google.com/test/rich-results
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://cyc-studio-visualization.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CYC Studio",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/cyc-logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "CYC Studio is a creative web studio focused on interactive visual experiences, spanning frontend design, motion interaction, data integration, and system implementation.",
      email: "cy4309@gmail.com",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CYC Studio",
      description:
        "Creative web studio building interactive visual experiences. Frontend design, motion interaction, WebAR, 3D, and AI integration.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: ["en", "zh-Hant"],
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
