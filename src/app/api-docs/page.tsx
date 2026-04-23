"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

/**
 * 內部／業主驗收用 API 參考（Scalar），spec 為 /openapi.yaml
 * 勿將 CRON_SECRET 寫入此頁；Try it 時自行在介面的 Authorize 填入 Bearer。
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 px-6 py-5">
        <h1 className="font-mono text-sm uppercase tracking-widest opacity-80">
          API 文件
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed opacity-50">
          OpenAPI 規格：<code className="opacity-80">/openapi.yaml</code>
          。請在<strong>已部署網域</strong>使用「Send Request」，base 才會正確。
          Cron 端點若需認證，請使用介面內的 <strong>Authorize</strong> 填入 Bearer
          金鑰。
        </p>
      </header>
      <ApiReferenceReact configuration={{ url: "/openapi.yaml" }} />
    </div>
  );
}
