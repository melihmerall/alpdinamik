# Upload 404 Hatası Çözümü

## Sorun

Dosya yükleniyor ama 404 hatası alınıyor:
```
GET http://178.157.14.211:3001/uploads/settings/1766040664723-favicon.jpg 404 (Not Found)
```

## Muhtemel Nedenler

1. **Dosya container içinde yazılıyor ama volume mount çalışmıyor**
2. **Dosya hiç yazılmıyor** (upload API hatası)
3. **Next.js public klasörü serve edilmiyor**

## Kontrol Et

```bash
cd /var/www/alpdinamik
chmod +x check-uploaded-file.sh
bash check-uploaded-file.sh
```

## Çözümler

### 1. Eğer Dosya Container İçinde Var Ama Sunucuda Yok

Volume mount çalışmıyor. Container'ı yeniden başlat:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production down
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 2. Eğer Dosya Hiç Yok

Upload API hatası var. Logları kontrol et:

```bash
docker logs alpdinamik-app --tail 100 | grep -i "upload\|error"
```

### 3. Next.js Public Serve Sorunu

Next.js standalone build'de public klasörü doğru serve edilmiyor olabilir. Kontrol et:

```bash
# Public klasörü var mı?
docker exec alpdinamik-app ls -la /app/public

# Next.js server.js public klasörünü serve ediyor mu?
docker exec alpdinamik-app cat /app/server.js | grep -i "public" | head -5
```

## Hızlı Test

```bash
# 1. Dosya var mı?
docker exec alpdinamik-app ls -la /app/public/uploads/settings/1766040664723-favicon.jpg

# 2. Sunucuda var mı?
ls -la /var/www/alpdinamik/uploads/settings/1766040664723-favicon.jpg

# 3. Volume mount çalışıyor mu?
docker inspect alpdinamik-app | grep -A 5 "Mounts"
```

## Notlar

- Next.js standalone build'de public klasörü otomatik serve edilir
- Eğer dosya container içinde varsa ama erişilemiyorsa, Next.js config sorunu olabilir
- Volume mount çalışmıyorsa, container'ı yeniden başlatmak gerekebilir

