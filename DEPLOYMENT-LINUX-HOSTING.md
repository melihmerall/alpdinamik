# 🚀 Linux Hosting Deployment Guide

Bu dokümantasyon, Alp Dinamik web sitesini geleneksel Linux hosting'e (cPanel, Plesk, vb.) deploy etme sürecini açıklar.

## 📋 Hosting Gereksinimleri

### Minimum Gereksinimler:
- **Node.js 18+** desteği (veya Node.js kurulum izni)
- **PostgreSQL** veya **MySQL/MariaDB** veritabanı
- **SSH erişimi** (tercihen)
- **PM2** veya benzeri process manager desteği
- **Minimum 1GB RAM**, 5GB disk alanı

### Önerilen Hosting Özellikleri:
- Node.js 20.x
- PostgreSQL 16 (veya MySQL 8+)
- SSL sertifikası (Let's Encrypt veya ücretli)
- Cron job desteği
- Email gönderimi (SMTP)

## 🔍 Hosting Seçenekleri

### 1. Node.js Destekli Linux Hosting
**Örnekler:** Hostinger, A2 Hosting, SiteGround, DigitalOcean App Platform

**Avantajlar:**
- Node.js hazır kurulu
- PM2 desteği
- Kolay deployment
- Otomatik SSL

**Dezavantajlar:**
- Genellikle daha pahalı
- Özelleştirme sınırlı

### 2. Geleneksel Linux Hosting (cPanel/Plesk)
**Örnekler:** TürkHost, Natro, Turhost

**Avantajlar:**
- Uygun fiyatlı
- cPanel/Plesk kontrol paneli
- Email, domain yönetimi kolay

**Dezavantajlar:**
- Node.js kurulumu gerekebilir
- SSH erişimi sınırlı olabilir
- PostgreSQL desteği olmayabilir (MySQL kullanılabilir)

### 3. VPS vs Linux Hosting Karşılaştırması

| Özellik | VPS | Linux Hosting |
|---------|-----|---------------|
| **Kontrol** | Tam kontrol | Sınırlı kontrol |
| **Maliyet** | Orta-Yüksek | Düşük-Orta |
| **Yönetim** | Manuel (SSH) | Panel (cPanel/Plesk) |
| **Özelleştirme** | Tam | Sınırlı |
| **Docker** | ✅ Evet | ❌ Hayır |
| **Node.js** | ✅ Kurulum | ⚠️ Destek gerekli |
| **Veritabanı** | Seçim özgürlüğü | Hosting'e bağlı |
| **SSL** | Manuel/Let's Encrypt | Otomatik/Let's Encrypt |

## 🎯 Deployment Senaryoları

### Senaryo 1: Node.js Destekli Hosting (Önerilen)

#### Adım 1: Hosting Hesabı Hazırlığı

1. Hosting hesabınızda:
   - Node.js uygulaması oluşturun
   - PostgreSQL veritabanı oluşturun
   - Domain'i bağlayın
   - SSL sertifikasını aktif edin

#### Adım 2: Proje Dosyalarını Yükleme

**Seçenek A: Git ile (Önerilen)**
```bash
# Hosting'in Git entegrasyonunu kullanın
# veya SSH ile:
cd ~/public_html
git clone https://github.com/your-repo/alpdinamik.git
cd alpdinamik
```

**Seçenek B: FTP/SFTP ile**
- Tüm proje dosyalarını ZIP olarak yükleyin
- Sunucuda unzip edin

#### Adım 3: Environment Variables

Hosting panelinizde environment variables ayarlayın:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=your_32_char_secret
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

#### Adım 4: Dependencies Kurulumu

```bash
npm install
npm run build
```

#### Adım 5: Database Migration

```bash
npx prisma generate
npx prisma migrate deploy
# veya
npx prisma db push
```

#### Adım 6: Uygulamayı Başlatma

**PM2 ile:**
```bash
pm2 start npm --name "alpdinamik" -- start
pm2 save
pm2 startup
```

**Hosting panelinden:**
- Node.js uygulamasını başlatın
- Start command: `npm start`
- Working directory: `/home/username/public_html/alpdinamik`

---

### Senaryo 2: Geleneksel cPanel Hosting

#### Adım 1: Node.js Kurulumu (Gerekirse)

**cPanel'de Node.js Selector:**
1. cPanel → Software → Setup Node.js App
2. Node.js versiyonu seçin (20.x önerilir)
3. Application root: `public_html/alpdinamik`
4. Application URL: `yourdomain.com`

#### Adım 2: Veritabanı Kurulumu

**MySQL kullanıyorsanız:**
- Prisma schema'yı MySQL'e uyarlamanız gerekir
- `prisma/schema.prisma` dosyasında:
  ```prisma
  datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
  }
  ```

**PostgreSQL kullanıyorsanız:**
- cPanel → PostgreSQL Databases
- Yeni veritabanı oluşturun

#### Adım 3: Dosya Yükleme

FTP/SFTP ile tüm dosyaları yükleyin:
```
public_html/
  └── alpdinamik/
      ├── app/
      ├── components/
      ├── prisma/
      ├── public/
      ├── package.json
      └── ...
```

#### Adım 4: Terminal/SSH ile Kurulum

```bash
cd ~/public_html/alpdinamik
npm install --production
npm run build
npx prisma generate
npx prisma migrate deploy
```

#### Adım 5: Uygulamayı Başlatma

**cPanel Node.js App:**
- Start App butonuna tıklayın
- Environment variables ekleyin

**Veya SSH ile PM2:**
```bash
pm2 start npm --name "alpdinamik" -- start
pm2 save
```

---

## 🔄 MySQL'e Geçiş (Gerekirse)

Eğer hosting'inizde PostgreSQL yoksa, MySQL'e geçiş yapabilirsiniz:

### 1. Prisma Schema Güncelleme

`prisma/schema.prisma` dosyasını düzenleyin:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Migration

```bash
npx prisma migrate dev --name mysql_migration
```

### 3. Environment Variable

```env
DATABASE_URL=mysql://user:password@host:3306/dbname
```

---

## 📁 Dosya Yapısı (Linux Hosting)

```
/home/username/
  └── public_html/          # veya domains/yourdomain.com/
      └── alpdinamik/
          ├── app/
          ├── components/
          ├── prisma/
          ├── public/
          │   └── uploads/  # Yazılabilir olmalı (chmod 755)
          ├── .env
          ├── package.json
          ├── next.config.mjs
          └── node_modules/
```

## 🔒 SSL Sertifikası

### cPanel/Plesk'te SSL:
1. SSL/TLS → Manage SSL Sites
2. Let's Encrypt sertifikası oluşturun
3. Domain'i seçin ve Install

### Otomatik SSL:
- Çoğu hosting otomatik SSL sağlar
- Let's Encrypt otomatik yenilenir

## 🔧 Environment Variables (Hosting Panelinde)

Hosting panelinizde şu environment variables'ları ayarlayın:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

## 📊 Monitoring ve Loglar

### PM2 ile:
```bash
pm2 logs alpdinamik
pm2 monit
pm2 status
```

### Hosting Panelinde:
- Logs bölümünden erişebilirsiniz
- Error logs, access logs

## 🔄 Güncelleme İşlemi

```bash
cd ~/public_html/alpdinamik
git pull origin main  # veya yeni dosyaları yükleyin
npm install
npm run build
npx prisma migrate deploy
pm2 restart alpdinamik
```

## 💾 Veritabanı Yedekleme

### cPanel'de:
1. cPanel → Backup → Download a MySQL/PostgreSQL Database Backup
2. Veritabanını indirin

### SSH ile:
```bash
# PostgreSQL
pg_dump -U username dbname > backup.sql

# MySQL
mysqldump -u username -p dbname > backup.sql
```

## ⚠️ Önemli Notlar

### 1. Port Yönetimi
- Linux hosting'de port 3000 kullanılamayabilir
- Hosting paneli otomatik port yönetimi yapar
- Genellikle reverse proxy kullanılır

### 2. Dosya İzinleri
```bash
chmod 755 public/uploads
chmod 644 .env
```

### 3. Memory Limit
- Node.js uygulamaları memory kullanabilir
- Hosting limitlerini kontrol edin
- Gerekirse memory limit artırın

### 4. Build Timeout
- `npm run build` uzun sürebilir
- Hosting timeout limitlerini kontrol edin
- SSH ile build yapın

## 🆚 VPS vs Linux Hosting: Hangisini Seçmeli?

### VPS Seçin Eğer:
- ✅ Tam kontrol istiyorsanız
- ✅ Docker kullanmak istiyorsanız
- ✅ Özelleştirme yapmak istiyorsanız
- ✅ Birden fazla uygulama çalıştıracaksanız
- ✅ Teknik bilginiz varsa

### Linux Hosting Seçin Eğer:
- ✅ Kolay yönetim istiyorsanız
- ✅ cPanel/Plesk gibi panel istiyorsanız
- ✅ Düşük maliyet istiyorsanız
- ✅ Tek bir site yayınlayacaksanız
- ✅ Teknik yönetim istemiyorsanız

## 📞 Hosting Sağlayıcıya Sorulacak Sorular

1. Node.js desteği var mı? Hangi versiyon?
2. PostgreSQL var mı, yoksa sadece MySQL?
3. SSH erişimi var mı?
4. PM2 veya process manager kullanabilir miyim?
5. SSL sertifikası otomatik mi?
6. Memory ve CPU limitleri nedir?
7. Cron job desteği var mı?
8. Email gönderimi (SMTP) var mı?

## 🎯 Hızlı Başlangıç (Node.js Hosting)

```bash
# 1. Projeyi yükle
cd ~/public_html
git clone https://github.com/your-repo/alpdinamik.git
cd alpdinamik

# 2. Dependencies
npm install

# 3. Environment variables (hosting panelinde ayarlayın)
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Build
npm run build

# 5. Database
npx prisma generate
npx prisma migrate deploy

# 6. Start (hosting panelinden veya PM2)
pm2 start npm --name "alpdinamik" -- start
```

---

**Sonuç:** Linux hosting kullanmak istiyorsanız, önce hosting sağlayıcınızın Node.js ve PostgreSQL desteğini kontrol edin. Eğer destekliyorsa, yukarıdaki adımları takip edebilirsiniz. Desteklemiyorsa, VPS daha uygun olabilir.

