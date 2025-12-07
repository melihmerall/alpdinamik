# i18n 404 Sorunu

## Durum
- `app/[locale]/page.jsx` dosyası var
- Route compile oluyor (970 modules)
- Ama 404 dönüyor
- `app/[locale]/not-found.tsx` gösteriliyor

## Test Edilenler
1. ✅ Cache temizleme (10+ kez)
2. ✅ [id] klasörleri silme
3. ✅ Middleware basitleştirme
4. ✅ Layout headers() kaldırma
5. ✅ Minimal test page
6. ✅ Server tam restart (node kill)

## Olası Nedenler
1. **next-intl config hatası** - `i18n.ts` veya `getRequestConfig`
2. **Middleware blocking** - Route'u doğru forward etmiyor
3. **Layout params** - Next 14/15 uyumsuzluğu
4. **File encoding** - UTF-8 BOM veya satır sonu karakteri
5. **Windows path issue** - Bracket karakterleri

## Önerilen Çözüm
`feature/i18n-fix` branch'inde:
1. next-intl'i tamamen kaldır
2. Manuel locale routing test et
3. Çalışırsa next-intl'i adım adım ekle

