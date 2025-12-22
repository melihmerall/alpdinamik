# Public Klasörü Serve Sorunu Çözümü

## Sorun

Dosya mevcut ama 404 hatası alınıyor:
- ✅ Dosya container içinde var
- ✅ Dosya sunucuda var (volume mount çalışıyor)
- ❌ Browser'dan erişilemiyor (404)

## Neden

Next.js standalone build'de public klasörü otomatik serve edilir ama bazen sorun olabilir.

## Çözüm

### 1. Next.js Public Serve Kontrolü

```bash
cd /var/www/alpdinamik
chmod +x check-nextjs-public-serving.sh
bash check-nextjs-public-serving.sh
```

### 2. Eğer Public Serve Edilmiyorsa

Next.js standalone build'de public klasörü `.next/standalone` içinde olmalı. Dockerfile'da kontrol et:

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
```

Bu satır var mı kontrol et.

### 3. Alternatif: Public Klasörünü Standalone'a Kopyala

Eğer sorun devam ederse, public klasörünü standalone build'e de kopyalayabiliriz.

### 4. Test

```bash
# Public dosyasına erişim testi
curl -I http://localhost:3001/assets/img/logo-2.png

# Upload dosyasına erişim testi
curl -I http://localhost:3001/uploads/settings/1766040664723-favicon.jpg
```

## Hızlı Kontrol

```bash
# 1. Public klasörü nerede?
docker exec alpdinamik-app find /app -name "public" -type d

# 2. Standalone public var mı?
docker exec alpdinamik-app ls -la /app/.next/standalone/public 2>/dev/null

# 3. Server.js public serve ediyor mu?
docker exec alpdinamik-app cat /app/server.js | grep -i "public"
```

