import { permanentRedirect } from "next/navigation";

/** 根網址永久導向預設語系（與 sitemap / x-default 一致） */
export default function RootPage() {
  permanentRedirect("/zh");
}
