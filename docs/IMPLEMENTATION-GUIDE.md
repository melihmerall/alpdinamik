# Alpdinamik - Implementation Guide
## Adım Adım Uygulama Kılavuzu

Bu doküman, `BACKEND-DB-ROADMAP.md`'deki planı adım adım uygulamak için pratik kılavuzdur.

---

## 🎯 Hızlı Başlangıç

### 1. Ortam Hazırlığı

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur
cp .env.example .env

# 3. .env dosyasını düzenle
# DATABASE_URL ve NEXTAUTH_SECRET değerlerini ayarla
```

### 2. Veritabanı Kurulumu

#### Seçenek A: Docker ile (Önerilen)

```bash
# PostgreSQL'i başlat
docker-compose up -d postgres

# Veritabanının hazır olmasını bekle (10-15 saniye)
docker-compose logs postgres
```

#### Seçenek B: Lokal PostgreSQL

```bash
# PostgreSQL'i manuel olarak kur ve çalıştır
# Sonra .env'deki DATABASE_URL'i güncelle
```

### 3. Prisma Setup

```bash
# 1. Prisma Client'ı generate et
npm run db:generate

# 2. Schema'yı veritabanına uygula
npm run db:push
# veya migration ile:
# npm run db:migrate -- --name init

# 3. Seed data'yı yükle
npm run db:seed
```

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

---

## 📋 Adım Adım Implementation Checklist

### Phase 1: Veritabanı ve Temel Yapı ✅ (Tamamlandı)

- [x] Prisma schema oluşturuldu
- [x] Temel entity'ler tanımlandı
- [x] lib/db.ts oluşturuldu
- [x] lib/content.ts oluşturuldu
- [x] lib/auth.ts oluşturuldu
- [x] lib/leads.ts oluşturuldu
- [x] Admin auth sistemi kuruldu

### Phase 2: Eksik Entity'lerin Eklenmesi

- [ ] TeamMember modeli eklendi ✅
- [ ] Testimonial modeli eklendi ✅
- [ ] Migration oluşturuldu
- [ ] Seed data eklendi

**Komutlar:**
```bash
# Schema'yı güncelle (yukarıdaki değişiklikler yapıldı)
npm run db:push

# Seed'i güncelle (team-data.jsx ve testimonial-data.jsx'ten veri ekle)
npm run db:seed
```

### Phase 3: API Routes Tamamlama

#### 3.1. Services API

**Dosya**: `app/api/services/route.ts`

```typescript
// GET /api/services - Public
// POST /api/services - Admin only
```

**Dosya**: `app/api/services/[slug]/route.ts`

```typescript
// GET /api/services/[slug] - Public
// PUT /api/services/[slug] - Admin only
// DELETE /api/services/[slug] - Admin only
```

#### 3.2. Blog API

**Dosya**: `app/api/blog/route.ts`

```typescript
// GET /api/blog?published=true&limit=10&page=1
// POST /api/blog - Admin only
```

**Dosya**: `app/api/blog/[slug]/route.ts`

```typescript
// GET /api/blog/[slug]
// PUT /api/blog/[slug] - Admin only
// DELETE /api/blog/[slug] - Admin only
```

#### 3.3. Portfolio/Reference Projects API

**Dosya**: `app/api/portfolio/route.ts`

```typescript
// GET /api/portfolio?sectorId=xxx&limit=10
// POST /api/portfolio - Admin only
```

#### 3.4. Team API

**Dosya**: `app/api/team/route.ts`

```typescript
// GET /api/team?active=true
// POST /api/team - Admin only
```

#### 3.5. Testimonials API

**Dosya**: `app/api/testimonials/route.ts`

```typescript
// GET /api/testimonials?active=true
// POST /api/testimonials - Admin only
```

### Phase 4: Public Sayfaları Dinamik Hale Getirme

#### 4.1. Home Page Services

**Dosya**: `components/pages/homes/home-2/services.jsx`

**Önceki (Statik):**
```jsx
import servicesData from "@/components/data/services-data";

const ServicesTwo = () => {
  return (
    <>
      {servicesData.map((service) => (
        // ...
      ))}
    </>
  );
};
```

**Sonraki (Dinamik):**
```jsx
// Server Component olarak
import { getServices } from '@/lib/content';

const ServicesTwo = async () => {
  const services = await getServices();
  
  return (
    <>
      {services.map((service) => (
        // ...
      ))}
    </>
  );
};
```

#### 4.2. Home Page Blog

**Dosya**: `components/pages/homes/home-2/blog.jsx`

```jsx
import { getPublishedBlogPosts } from '@/lib/content';

const BlogTwo = async () => {
  const posts = await getPublishedBlogPosts(6); // Son 6 blog
  
  return (
    <>
      {posts.map((post) => (
        // ...
      ))}
    </>
  );
};
```

#### 4.3. Home Page Portfolio

**Dosya**: `components/pages/homes/home-2/portfolio.jsx`

```jsx
import { getReferenceProjects } from '@/lib/content';

const PortfolioTwo = async () => {
  const projects = await getReferenceProjects(8); // Son 8 proje
  
  return (
    <>
      {projects.map((project) => (
        // ...
      ))}
    </>
  );
};
```

#### 4.4. Home Page Testimonials

**Dosya**: `components/pages/homes/home-2/testimonial.jsx`

```jsx
// lib/content.ts'e ekle:
export async function getActiveTestimonials(limit?: number) {
  return await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: limit,
  });
}

// Component'te:
import { getActiveTestimonials } from '@/lib/content';

const TestimonialTwo = async () => {
  const testimonials = await getActiveTestimonials(5);
  
  return (
    <>
      {testimonials.map((testimonial) => (
        // ...
      ))}
    </>
  );
};
```

### Phase 5: Admin Panel CRUD Sayfaları

#### 5.1. Services Management

**Dosya**: `app/(admin)/services/page.tsx` (Liste)
**Dosya**: `app/(admin)/services/new/page.tsx` (Yeni)
**Dosya**: `app/(admin)/services/[slug]/edit/page.tsx` (Düzenle)

#### 5.2. Blog Management

**Dosya**: `app/(admin)/blog/page.tsx`
**Dosya**: `app/(admin)/blog/new/page.tsx`
**Dosya**: `app/(admin)/blog/[slug]/edit/page.tsx`

#### 5.3. Portfolio Management

**Dosya**: `app/(admin)/references/page.tsx`
**Dosya**: `app/(admin)/references/new/page.tsx`
**Dosya**: `app/(admin)/references/[slug]/edit/page.tsx`

#### 5.4. Team Management

**Dosya**: `app/(admin)/team/page.tsx`
**Dosya**: `app/(admin)/team/new/page.tsx`
**Dosya**: `app/(admin)/team/[slug]/edit/page.tsx`

#### 5.5. Testimonials Management

**Dosya**: `app/(admin)/testimonials/page.tsx`
**Dosya**: `app/(admin)/testimonials/new/page.tsx`
**Dosya**: `app/(admin)/testimonials/[id]/edit/page.tsx`

### Phase 6: Form Entegrasyonu

#### 6.1. Request Quote Form

**Dosya**: `components/pages/request-quote/request-quote.jsx`

```jsx
"use client"
import { useState } from 'react';

const RequestQuoteMain = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const file = formData.get('file');
    
    const data = {
      fullName: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      source: 'PROJECT_FORM',
      meta: {
        kvkk: formData.get('kvkk') === 'on',
      },
    };

    if (file && file.size > 0) {
      // File upload için ayrı endpoint gerekebilir
      // Şimdilik sadece meta'ya ekle
      data.meta.fileName = file.name;
      data.meta.fileSize = file.size;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        e.target.reset();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Phase 7: Docker Setup

#### 7.1. Dockerfile Oluştur

**Dosya**: `Dockerfile` (root'ta)

```dockerfile
# Yukarıdaki BACKEND-DB-ROADMAP.md'deki Dockerfile içeriği
```

#### 7.2. Docker Compose

**Dosya**: `docker-compose.yml` (root'ta)

```yaml
# Yukarıdaki BACKEND-DB-ROADMAP.md'deki docker-compose.yml içeriği
```

#### 7.3. Test

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f app

# Stop
docker-compose down
```

---

## 🐛 Troubleshooting

### Prisma Client Hatası

```bash
# Prisma Client'ı yeniden generate et
npm run db:generate
```

### Database Connection Hatası

```bash
# PostgreSQL'in çalıştığından emin ol
docker-compose ps

# Connection string'i kontrol et
echo $DATABASE_URL
```

### Migration Hatası

```bash
# Veritabanını sıfırla (DİKKAT: Tüm veriler silinir!)
npm run db:push -- --force-reset

# Veya manuel migration
npm run db:migrate -- --name reset
```

---

## 📝 Notlar

1. **Server vs Client Components**: 
   - Veri çeken component'ler Server Component olmalı
   - Form ve interaktif elementler Client Component olmalı

2. **Type Safety**:
   - TypeScript kullanımını artır
   - Prisma types'ı kullan: `import { Service } from '@prisma/client'`

3. **Error Handling**:
   - Tüm API route'larında try-catch kullan
   - Kullanıcıya anlamlı hata mesajları göster

4. **Performance**:
   - Gereksiz re-render'ları önle (React.memo, useMemo)
   - Database query'lerini optimize et (select, include)

---

## ✅ Son Kontrol Listesi

Uygulamayı tamamlamadan önce:

- [ ] Tüm API routes test edildi
- [ ] Public sayfalar dinamik veri gösteriyor
- [ ] Admin panel tüm CRUD işlemlerini yapabiliyor
- [ ] Form gönderimleri çalışıyor
- [ ] Docker ile production build başarılı
- [ ] SEO meta tag'leri dinamik
- [ ] Error handling mevcut
- [ ] Loading state'leri gösteriliyor

---

**Son Güncelleme**: 2025-01-XX

