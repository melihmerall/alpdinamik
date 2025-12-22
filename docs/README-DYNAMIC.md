# Alpdinamik - Dinamik CMS Sistemi

Bu proje, Next.js 14 (App Router) ve PostgreSQL + Prisma kullanılarak dinamik bir CMS sistemi olarak geliştirilmiştir.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Veritabanı Kurulumu

1. PostgreSQL veritabanı oluşturun
2. `.env` dosyası oluşturun ve `DATABASE_URL` ekleyin:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/alpdinamik?schema=public"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

3. Prisma schema'yı veritabanına uygulayın:

```bash
npm run db:push
```

4. Başlangıç verilerini yükleyin:

```bash
npm run db:seed
```

### 3. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

## 📁 Proje Yapısı

```
├── app/
│   ├── (admin)/          # Admin panel sayfaları
│   │   ├── login/        # Admin giriş
│   │   └── page.tsx      # Dashboard
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── leads/        # Form submissions
│   │   └── menu/         # Menu data
│   └── [public pages]    # Public sayfalar
├── components/
│   ├── admin/            # Admin UI components
│   ├── layout/           # Layout components
│   └── pages/            # Page components
├── lib/
│   ├── auth.ts           # Authentication helpers
│   ├── content.ts        # Content fetching
│   ├── db.ts             # Prisma client
│   ├── leads.ts          # Lead management
│   └── middleware.ts     # Auth middleware
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed data
```

## 🗄️ Veritabanı Modelleri

- **ContentBlock**: Statik metin blokları (hero, header, footer)
- **CompanyPage**: Kurumsal sayfalar (Hakkımızda, Misyon & Vizyon)
- **Service**: Hizmetler
- **Sector**: Sektörler
- **Representative**: Temsilcilikler (Mecmot vb.)
- **Product**: Ürünler (Representative altında)
- **BlogPost**: Blog yazıları
- **ReferenceProject**: Referans projeler
- **Banner**: Hero slider bannerları
- **BannerMessage**: Kayan yazılar
- **Lead**: Form talepleri
- **User**: Admin kullanıcılar

## 🔐 Admin Panel

- URL: `/admin`
- Varsayılan kullanıcı:
  - Email: `admin@alpdinamik.com.tr`
  - Şifre: `admin123`

## 📝 Özellikler

- ✅ Dinamik menü yapısı (Temsilcilikler > Ürünler)
- ✅ Tüm içerikler veritabanından
- ✅ Admin panel ile içerik yönetimi
- ✅ Form talepleri yönetimi
- ✅ SEO dostu URL yapısı
- ✅ TypeScript desteği

## 🔄 Sonraki Adımlar

1. Admin panel CRUD sayfalarını tamamla
2. Public sayfaları dinamik hale getir
3. Rich text editor entegrasyonu
4. Dosya yükleme sistemi
5. Çoklu dil desteği (opsiyonel)

