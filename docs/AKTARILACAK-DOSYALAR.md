# 📦 Sunucuya Aktarılacak Dosyalar

## ✅ MUTLAKA AKTARILMASI GEREKENLER

### 1. Kaynak Kod Dosyaları
- ✅ `app/` - Tüm Next.js app klasörü
- ✅ `components/` - Tüm component'ler
- ✅ `lib/` - Library dosyaları
- ✅ `prisma/` - Prisma schema ve migrations
- ✅ `public/` - Public assets (resimler, CSS, JS)

### 2. Konfigürasyon Dosyaları
- ✅ `package.json` - NPM bağımlılıkları
- ✅ `package-lock.json` - NPM lock dosyası
- ✅ `tsconfig.json` - TypeScript config
- ✅ `jsconfig.json` - JavaScript config
- ✅ `next.config.mjs` - Next.js config
- ✅ `Dockerfile` - Production Dockerfile
- ✅ `Dockerfile.dev` - Development Dockerfile (opsiyonel)
- ✅ `docker-compose.prod.yml` - Production Docker Compose
- ✅ `.gitignore` - Git ignore dosyası

### 3. Deployment Scriptleri
- ✅ `sunucuda-deploy.sh` - Sunucuda çalıştırılacak script
- ✅ `import-database.sh` - Database import scripti

### 4. Database Dump
- ✅ `alpdinamik-dump-20251216-120033.sql` - Database dump dosyası

---

## ❌ AKTARILMAMASI GEREKENLER (Otomatik Hariç)

### 1. Build ve Cache Klasörleri
- ❌ `node_modules/` - Sunucuda `npm install` yapılacak
- ❌ `.next/` - Sunucuda `npm run build` yapılacak
- ❌ `out/` - Build output
- ❌ `.cache/` - Cache dosyaları

### 2. Environment Dosyaları
- ❌ `.env` - Yerel environment
- ❌ `.env.local` - Yerel environment
- ❌ `.env.development.local` - Development environment
- ❌ `.env.production.local` - Production environment (sunucuda oluşturulacak)
- ❌ `.env.production` - Sunucuda oluşturulacak

### 3. Git ve IDE Dosyaları
- ❌ `.git/` - Git repository (gereksiz)
- ❌ `.vscode/` - VS Code ayarları
- ❌ `.idea/` - JetBrains IDE ayarları

### 4. Eski Dump Dosyaları
- ❌ `dump.sql` - Eski dump (yeni dump'ı aktarıyoruz)

### 5. Log ve Geçici Dosyalar
- ❌ `*.log` - Log dosyaları
- ❌ `logs/` - Log klasörü
- ❌ `tmp/` - Geçici dosyalar
- ❌ `temp/` - Geçici dosyalar

---

## 🎯 WinSCP ile Aktarım

### Yöntem 1: Tüm Klasörü Aktar (Önerilen)
1. WinSCP'de sol tarafta: `C:\Users\Administrator\Desktop\AlpDinamik-Çalışması\alpdinamik`
2. Sağ tarafta: `/var/www/alpdinamik`
3. **Sadece şu klasörleri seç ve aktar:**
   - `app/`
   - `components/`
   - `lib/`
   - `prisma/`
   - `public/`
   - `package.json`
   - `package-lock.json`
   - `tsconfig.json`
   - `jsconfig.json`
   - `next.config.mjs`
   - `Dockerfile`
   - `docker-compose.prod.yml`
   - `sunucuda-deploy.sh`
   - `import-database.sh`
   - `alpdinamik-dump-20251216-120033.sql`
   - `.gitignore`

### Yöntem 2: Filtreleme ile Aktar
WinSCP'de:
1. **Seçenekler > Tercihler > Paneller > Filtreler**
2. **Hariç Tut** listesine ekle:
   - `node_modules`
   - `.next`
   - `.git`
   - `.env*`
   - `*.log`
   - `dump.sql`
3. Tüm klasörü sürükle-bırak ile aktar

---

## 📋 Aktarım Sonrası Kontrol

Sunucuda şu komutları çalıştırın:

```bash
cd /var/www/alpdinamik
ls -la

# Şunlar görünmeli:
# - app/
# - components/
# - lib/
# - prisma/
# - public/
# - package.json
# - Dockerfile
# - docker-compose.prod.yml
# - sunucuda-deploy.sh
# - import-database.sh
# - alpdinamik-dump-20251216-120033.sql
```

---

## ⚡ Hızlı Aktarım (PowerShell)

Eğer PowerShell'den aktarmak isterseniz:

```powershell
# Sadece gerekli dosyaları aktar
scp -P 23422 -r app components lib prisma public package.json package-lock.json tsconfig.json jsconfig.json next.config.mjs Dockerfile docker-compose.prod.yml sunucuda-deploy.sh import-database.sh alpdinamik-dump-20251216-120033.sql root@178.157.14.211:/var/www/alpdinamik/
```

