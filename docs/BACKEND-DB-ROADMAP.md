# Next.js Projesinden Backend & DB Çıkarma Yol Haritası
## Alpdinamik - Lineer Hareket Sistemleri

---

## 📋 1. PROJE ANALİZİ VE MEVCUT DURUM

### 1.1. Teknoloji Stack (Mevcut)
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/TypeScript (karma)
- **UI**: React 18 (Server + Client Components)
- **Styling**: Bootstrap 5 + Custom SCSS
- **ORM**: Prisma (kuruldu, schema mevcut)
- **Database**: PostgreSQL (henüz bağlanmadı)

### 1.2. Mevcut Route Yapısı

| Route | Modül | Entity'ler | Durum |
|-------|-------|-----------|-------|
| `/` | Home | Banner, Service, Portfolio, Blog, Testimonial | ✅ Statik |
| `/about-us` | Company | CompanyPage (Hakkımızda) | ⚠️ Kısmen dinamik |
| `/history` | Company | CompanyPage (Misyon & Vizyon) | ⚠️ Kısmen dinamik |
| `/services` | Services | Service | ✅ Statik (services-data.jsx) |
| `/services/[id]` | Services | Service (detay) | ✅ Statik |
| `/blog` | Blog | BlogPost | ✅ Statik (blog-data.jsx) |
| `/blog/[id]` | Blog | BlogPost (detay) | ✅ Statik |
| `/portfolio` | Portfolio | ReferenceProject | ✅ Statik (portfolio-data.jsx) |
| `/portfolio/[id]` | Portfolio | ReferenceProject (detay) | ✅ Statik |
| `/contact-us` | Contact | Lead | ✅ Form mevcut |
| `/request-quote` | Leads | Lead (proje talebi) | ✅ Form mevcut |
| `/temsilcilikler/[slug]` | Representatives | Representative, Product | ❌ Eksik |
| `/temsilcilikler/[slug]/urunler/[productSlug]` | Products | Product | ❌ Eksik |
| `/sektorler` | Sectors | Sector | ❌ Eksik |

### 1.3. Statik Veri Dosyaları (DB'ye Taşınacak)

#### `components/data/services-data.jsx`
```javascript
Entity: Service
Fields:
- id (string)
- title (string)
- description (string)
- icon (React element → string olarak saklanacak)
- image (image import → imageUrl string)
- number (string → order int)
```

#### `components/data/blog-data.jsx`
```javascript
Entity: BlogPost
Fields:
- id (string → slug)
- title (string)
- description (string → summary)
- image (image import → imageUrl string)
- date (string → publishedAt DateTime)
- comment (string → commentCount int, ayrı model gerekebilir)
- number (string → order, gerekirse)
```

#### `components/data/portfolio-data.jsx`
```javascript
Entity: ReferenceProject
Fields:
- id (string → slug)
- title (string)
- subtitle (string → summary)
- image (image import → imageUrl string)
- category (string → sectorId FK)
```

#### `components/data/team-data.jsx` (varsa)
```javascript
Entity: TeamMember
Fields:
- id, name, role, image, bio, socialLinks
```

#### `components/data/testimonial-data.jsx`
```javascript
Entity: Testimonial
Fields:
- id, name, role, company, image, message, rating
```

### 1.4. Form Yapıları

#### `/request-quote` Formu
```javascript
Fields:
- name (string) → fullName
- email (string)
- phone (string)
- message (string)
- file (File) → meta.fileName, meta.fileSize
- kvkk (boolean)
Source: PROJECT_FORM
```

#### `/contact-us` Formu
```javascript
Fields:
- name, email, phone, message
Source: CONTACT_FORM
```

---

## 🗄️ 2. KAVRAMSAL VERİ MODELİ (ER Model)

### 2.1. Entity Listesi ve İlişkiler

```
ContentBlock (✅ Mevcut)
├── key (unique)
├── title
└── body

CompanyPage (✅ Mevcut)
├── slug (unique)
├── title
└── body

Service (✅ Mevcut)
├── slug (unique)
├── title
├── summary
├── body
├── icon
├── imageUrl
└── order

Sector (✅ Mevcut)
├── slug (unique)
├── name
├── description
├── body
├── icon
├── imageUrl
└── order
└── 1:N → ReferenceProject

Representative (✅ Mevcut)
├── slug (unique)
├── name
├── description
├── logoUrl
├── websiteUrl
├── order
└── isActive
└── 1:N → Product

Product (✅ Mevcut)
├── slug (unique, composite: representativeId + slug)
├── name
├── description
├── body
├── imageUrl
├── order
├── isActive
└── N:1 → Representative

BlogPost (✅ Mevcut)
├── slug (unique)
├── title
├── summary
├── body
├── publishedAt
└── isPublished

ReferenceProject (✅ Mevcut)
├── slug (unique)
├── title
├── summary
├── body
├── imageUrl
├── year
├── customerName
├── location
└── N:1 → Sector

Banner (✅ Mevcut)
├── title
├── subtitle
├── imageUrl
├── ctaLabel
├── ctaUrl
├── isActive
└── order

BannerMessage (✅ Mevcut)
├── message
├── isActive
└── order

Lead (✅ Mevcut)
├── fullName
├── email
├── phone
├── source (enum)
├── message
└── meta (JSON)

User (✅ Mevcut)
├── email (unique)
├── passwordHash
├── name
└── role (enum)

TeamMember (❌ Eksik - Eklenecek)
├── slug (unique)
├── name
├── role
├── bio
├── imageUrl
├── email
├── phone
├── socialLinks (JSON)
├── order
└── isActive

Testimonial (❌ Eksik - Eklenecek)
├── name
├── role
├── company
├── imageUrl
├── message
├── rating (int, 1-5)
├── isActive
└── order

ProductCategory (❌ Eksik - Opsiyonel)
├── slug
├── name
└── description
└── N:M → Product (junction: ProductCategoryProduct)

BlogCategory (❌ Eksik - Opsiyonel)
├── slug
├── name
└── description
└── N:M → BlogPost (junction: BlogPostCategory)

BlogComment (❌ Eksik - Opsiyonel)
├── name
├── email
├── message
├── isApproved
└── N:1 → BlogPost
```

---

## 📊 3. POSTGRESQL ŞEMA TASARIMI

### 3.1. Eksik Entity'lerin Prisma Schema'ya Eklenmesi

```prisma
// prisma/schema.prisma'ya eklenecek

model TeamMember {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  role        String
  bio         String?  @db.Text
  imageUrl    String?
  email       String?
  phone       String?
  socialLinks Json?    // {linkedin, twitter, github, etc.}
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("team_members")
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String?
  company   String?
  imageUrl  String?
  message   String   @db.Text
  rating    Int?     // 1-5
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("testimonials")
}

// Opsiyonel: Blog kategorileri
model BlogCategory {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts       BlogPostCategory[]

  @@map("blog_categories")
}

model BlogPostCategory {
  id             String   @id @default(cuid())
  blogPostId     String
  blogCategoryId String
  createdAt      DateTime @default(now())

  blogPost       BlogPost     @relation(fields: [blogPostId], references: [id], onDelete: Cascade)
  blogCategory   BlogCategory @relation(fields: [blogCategoryId], references: [id], onDelete: Cascade)

  @@unique([blogPostId, blogCategoryId])
  @@map("blog_post_categories")
}

// BlogPost'a relation ekle
model BlogPost {
  // ... mevcut alanlar
  categories BlogPostCategory[]
}
```

### 3.2. Migration Stratejisi

```bash
# 1. Schema'yı güncelle
# 2. Migration oluştur
npm run db:migrate -- --name add_team_testimonial

# 3. Seed data ekle (mevcut statik verileri DB'ye)
npm run db:seed
```

---

## 🔧 4. BACKEND SERVİS TASARIMI

### 4.1. Mimari Karar: Next.js API Routes vs Ayrı Backend

**Öneri**: **Hibrit Yaklaşım**
- **Kısa vadede**: Next.js API Routes kullan (zaten başladık)
- **Uzun vadede**: Ayrı NestJS backend'e geçiş (opsiyonel)

**Neden Hibrit?**
- Next.js API Routes yeterli (CRUD, auth, file upload)
- SSR/SSG avantajları korunur
- Deployment basit (tek servis)
- İhtiyaç olursa ayrı backend'e kolay geçiş

### 4.2. Next.js API Routes Yapısı (Mevcut + Genişletilecek)

```
app/api/
├── auth/
│   ├── login/route.ts ✅
│   ├── logout/route.ts ✅
│   └── me/route.ts (eklenecek)
├── menu/route.ts ✅
├── leads/route.ts ✅
├── content-blocks/
│   ├── route.ts (GET list, POST create)
│   └── [key]/route.ts (GET, PUT, DELETE)
├── company-pages/
│   ├── route.ts
│   └── [slug]/route.ts
├── services/
│   ├── route.ts
│   └── [slug]/route.ts
├── sectors/
│   ├── route.ts
│   └── [slug]/route.ts
├── representatives/
│   ├── route.ts
│   ├── [slug]/route.ts
│   └── [slug]/products/
│       ├── route.ts
│       └── [productSlug]/route.ts
├── blog/
│   ├── route.ts
│   └── [slug]/route.ts
├── portfolio/
│   ├── route.ts
│   └── [slug]/route.ts
├── team/
│   └── route.ts
└── testimonials/
    └── route.ts
```

### 4.3. API Response Standardı

```typescript
// lib/api-response.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
    traceId?: string
  }
}
```

### 4.4. CRUD Fonksiyon Örnekleri

```typescript
// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/middleware'

// GET /api/services
export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({
      success: true,
      data: services,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICES_FETCH_ERROR',
          message: 'Failed to fetch services',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/services (Admin only)
export async function POST(request: NextRequest) {
  const user = await verifyAuth()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        slug: body.slug,
        title: body.title,
        summary: body.summary,
        body: body.body,
        icon: body.icon,
        order: body.order || 0,
      },
    })
    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVICE_CREATE_ERROR',
          message: 'Failed to create service',
        },
      },
      { status: 500 }
    )
  }
}
```

---

## 🐳 5. DOCKER & DOCKER COMPOSE SETUP

### 5.1. Dockerfile (Next.js)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Not**: `next.config.mjs`'e şunu ekle:
```javascript
output: 'standalone',
```

### 5.2. Docker Compose

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: alpdinamik-db
    environment:
      POSTGRES_USER: alpdinamik
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
      POSTGRES_DB: alpdinamik_db
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./prisma/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U alpdinamik"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - alpdinamik-network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: alpdinamik-app
    environment:
      DATABASE_URL: postgresql://alpdinamik:${DB_PASSWORD:-changeme}@postgres:5432/alpdinamik_db?schema=public
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-changeme-secret}
      NEXTAUTH_URL: http://localhost:3000
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - alpdinamik-network
    restart: unless-stopped

volumes:
  postgres-data:

networks:
  alpdinamik-network:
    driver: bridge
```

### 5.3. .env.example

```env
# Database
DATABASE_URL="postgresql://alpdinamik:changeme@localhost:5432/alpdinamik_db?schema=public"

# Auth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

---

## 📝 6. MIGRATION & SEED STRATEJİSİ

### 6.1. Mevcut Statik Verileri DB'ye Taşıma

```typescript
// prisma/seed.ts (genişletilmiş)

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ... mevcut seed kodları

  // Services'i ekle
  const servicesData = [
    {
      slug: 'proje-tasarimi-muhendislik',
      title: 'Proje Tasarımı & Mühendislik',
      summary: 'Uygulamanızın yük, strok, hız ve çalışma çevrimi gibi parametrelerini analiz ederek en doğru lineer hareket çözümünü tasarlıyoruz.',
      icon: 'flaticon-project',
      order: 1,
    },
    // ... diğerleri
  ]

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  // Blog posts
  const blogData = [
    {
      slug: 'lineer-hareket-sistemlerinde-dogru-urun-secimi',
      title: 'Lineer Hareket Sistemlerinde Doğru Ürün Seçimi',
      summary: 'Vidalı kriko, yön değiştirici ve lineer aktüatör seçiminde dikkat edilmesi gereken kritik parametreler...',
      body: '...',
      publishedAt: new Date('2025-01-10'),
      isPublished: true,
    },
    // ... diğerleri
  ]

  for (const post of blogData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  // Portfolio/Reference Projects
  const portfolioData = [
    {
      slug: 'endustriyel-pres-hatti',
      title: 'Endüstriyel Pres Hattı Seviye Ayarlama Sistemi',
      summary: 'Çelik Endüstrisi',
      sectorId: 'celik-endustrisi', // Sector slug'dan ID bul
    },
    // ... diğerleri
  ]

  // ... devamı
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## 🚀 7. UYGULAMA ADIMLARI

### Adım 1: Veritabanı Kurulumu
```bash
# 1. PostgreSQL'i başlat (Docker ile)
docker-compose up -d postgres

# 2. .env dosyasını oluştur
cp .env.example .env
# DATABASE_URL'i düzenle

# 3. Prisma migrate
npm run db:push
# veya
npm run db:migrate

# 4. Seed data
npm run db:seed
```

### Adım 2: Eksik Entity'leri Ekle
```bash
# 1. Prisma schema'yı güncelle (TeamMember, Testimonial ekle)
# 2. Migration oluştur
npm run db:migrate -- --name add_team_testimonial

# 3. Seed'e ekle
```

### Adım 3: API Routes'ları Tamamla
- [ ] `/api/services/*`
- [ ] `/api/blog/*`
- [ ] `/api/portfolio/*`
- [ ] `/api/team/*`
- [ ] `/api/testimonials/*`
- [ ] `/api/representatives/*`
- [ ] `/api/sectors/*`

### Adım 4: Public Sayfaları Dinamik Hale Getir
- [ ] `components/pages/homes/home-2/services.jsx` → DB'den çek
- [ ] `components/pages/homes/home-2/blog.jsx` → DB'den çek
- [ ] `components/pages/homes/home-2/portfolio.jsx` → DB'den çek
- [ ] `components/pages/homes/home-2/testimonial.jsx` → DB'den çek

### Adım 5: Admin Panel CRUD Sayfaları
- [ ] `/admin/services` (list, create, edit)
- [ ] `/admin/blog` (list, create, edit)
- [ ] `/admin/portfolio` (list, create, edit)
- [ ] `/admin/team` (list, create, edit)
- [ ] `/admin/testimonials` (list, create, edit)
- [ ] `/admin/representatives` (list, create, edit, products)
- [ ] `/admin/sectors` (list, create, edit)

### Adım 6: Docker ile Production Deploy
```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f app
```

---

## 📚 8. SONRAKI ADIMLAR (Opsiyonel)

1. **Rich Text Editor**: Admin panelde içerik düzenleme için (Tiptap, Quill)
2. **File Upload**: S3 veya local storage ile dosya yükleme
3. **Email Service**: Lead'ler için email bildirimleri (Resend, SendGrid)
4. **Search**: Full-text search (PostgreSQL tsvector veya Algolia)
5. **Analytics**: Sayfa görüntüleme, lead tracking
6. **Multi-language**: i18n desteği (next-intl)
7. **Ayrı Backend**: NestJS'e geçiş (ihtiyaç olursa)

---

## ✅ ÖZET CHECKLIST

- [x] Prisma schema oluşturuldu
- [x] Temel lib dosyaları hazır
- [x] Admin panel başlangıcı
- [x] Auth sistemi (JWT)
- [ ] Eksik entity'ler eklendi (TeamMember, Testimonial)
- [ ] Tüm API routes tamamlandı
- [ ] Public sayfalar dinamik hale getirildi
- [ ] Admin CRUD sayfaları tamamlandı
- [ ] Docker setup hazır
- [ ] Production deployment

---

**Son Güncelleme**: 2025-01-XX
**Versiyon**: 1.0.0

