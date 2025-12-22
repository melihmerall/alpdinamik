# 🔐 Admin Panel Erişim Bilgileri

## Giriş Bilgileri

**URL**: `http://localhost:3000/admin/login`

**Varsayılan Kullanıcı**:
- **Email**: `admin@alpdinamik.com.tr`
- **Şifre**: `admin123`

## Admin Panel Özellikleri

### ✅ Mevcut Sayfalar

1. **Dashboard** (`/admin`)
   - İstatistikler (Talep, Blog, Hizmet, Sektör sayıları)
   - Son gelen talepler listesi

2. **Hizmetler** (`/admin/services`)
   - Hizmet listesi
   - Yeni hizmet ekleme (yakında)
   - Düzenleme (yakında)

3. **Blog Yazıları** (`/admin/blog`)
   - Blog yazıları listesi
   - Yeni yazı ekleme (yakında)
   - Düzenleme (yakında)

4. **Referanslar** (`/admin/references`)
   - Referans projeler listesi
   - Yeni proje ekleme (yakında)
   - Düzenleme (yakında)

5. **Ekip Üyeleri** (`/admin/team`)
   - Ekip üyeleri listesi
   - Yeni üye ekleme (yakında)
   - Düzenleme (yakında)

6. **Referanslar (Testimonials)** (`/admin/testimonials`)
   - Müşteri referansları listesi
   - Yeni referans ekleme (yakında)
   - Düzenleme (yakında)

7. **Talepler** (`/admin/leads`)
   - Formlardan gelen tüm talepler
   - Detay görüntüleme

8. **Temsilcilikler** (`/admin/representatives`)
   - Temsilcilik listesi
   - Ürün yönetimi

### ⚠️ Eksik Sayfalar (Yakında Eklenecek)

- İçerik Blokları (`/admin/content-blocks`)
- Kurumsal Sayfalar (`/admin/company-pages`)
- Sektörler (`/admin/sectors`)
- Bannerlar (`/admin/banners`)
- Kullanıcılar (`/admin/users`)

## Kullanım

1. Tarayıcıda `http://localhost:3000/admin/login` adresine git
2. Email ve şifre ile giriş yap
3. Dashboard'dan tüm modüllere erişebilirsin

## Notlar

- Admin panel sadece giriş yapmış kullanıcılar için erişilebilir
- Tüm admin sayfaları otomatik olarak korunur (auth middleware)
- Çıkış yapmak için header'daki "Çıkış" butonuna tıkla

