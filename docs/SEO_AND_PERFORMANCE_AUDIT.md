# SEO 與效能稽核報告

## 4. 動畫與第三方套件負擔

### 目前使用的套件

| 套件 | 用途 | 預估大小 | 建議 |
|------|------|----------|------|
| **gsap** + ScrollTrigger | 捲動動畫、進入動畫 | ~55KB (gzip) | ✅ 保留，業界標準，效能佳 |
| **@studio-freight/react-lenis** | 平滑捲動 | ~15KB | ✅ 保留，體驗佳 |
| **p5** | P5ParticleBackground（粒子背景） | ~500KB+ | ⚠️ 目前 HeroSection 中已註解，未實際載入。若未來啟用，建議改為 `dynamic import` 延遲載入 |

### 優化建議

1. **p5**：若 P5ParticleBackground 不再使用，可從 `package.json` 移除以減少 bundle。
2. **GSAP**：已使用 `gsap.context()` 與 `ctx.revert()` 正確清理，避免 memory leak。
3. **Lenis**：smooth scroll 對 LCP 影響小，可保留。
