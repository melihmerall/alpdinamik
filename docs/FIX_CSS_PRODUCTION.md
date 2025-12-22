# CSS Production Sorunu Çözümü

## Sorun
- Local'de `npm run dev` ile çalışınca CSS düzgün görünüyor
- Production build'de CSS dosyaları yükleniyor ama uygulanmıyor
- Sayfa konumları kötü, CSS işlememiş

## Neden
`globals.css` dosyasında `@import url('/assets/css/...')` şeklinde CSS dosyaları yükleniyor. Next.js production build'de bu dosyaları optimize etmiyor ve path'ler yanlış olabiliyor.

## Çözüm

### 1. CSS Dosyalarını Dinamik Yükleme ✅
`app/layout.jsx` dosyasında `useEffect` ile CSS dosyalarını dinamik olarak yüklüyoruz:

```javascript
useEffect(() => {
    const cssFiles = [
        '/assets/css/fontawesome.css',
        '/assets/font/flaticon_flexitype.css',
        '/assets/css/animate.css',
        '/assets/css/meanmenu.min.css',
        '/assets/sass/style.css'
    ];

    cssFiles.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
}, []);
```

### 2. globals.css'den CSS Import'larını Kaldırma ✅
`app/globals.css` dosyasından public klasöründeki CSS import'larını kaldırdık. Sadece npm paketlerinden gelen CSS'ler kaldı:

```css
@import 'bootstrap/dist/css/bootstrap.min.css';
@import "swiper/css/bundle";
@import 'react-modal-video/css/modal-video.min.css';
```

## Test Et

### Sunucuda Yeniden Build
```bash
cd /var/www/alpdinamik
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Kontrol Et
1. http://178.157.14.211:3001/ adresini aç
2. F12 → Network → CSS dosyaları yükleniyor mu kontrol et
3. Sayfa düzgün görünüyor mu kontrol et

## Alternatif Çözüm (Gerekirse)

Eğer dinamik yükleme çalışmazsa, CSS dosyalarını doğrudan import edebiliriz:

```javascript
// app/layout.jsx
import '/public/assets/css/fontawesome.css';
import '/public/assets/font/flaticon_flexitype.css';
// ...
```

Ama bu Next.js'in public klasör yapısına uygun değil.

## Notlar

1. **FOUC (Flash of Unstyled Content)**: CSS dosyaları dinamik yüklendiği için ilk render'da stil olmayabilir. Bu normaldir.

2. **Cache**: Browser cache'ini temizle (Ctrl+Shift+R).

3. **Docker**: Public klasörünün doğru kopyalandığından emin ol:
   ```bash
   docker exec alpdinamik-app ls -la /app/public/assets/css/
   ```

## Sorun Devam Ederse

1. **CSS Dosyalarını Kontrol Et:**
   ```bash
   docker exec alpdinamik-app find /app/public -name "*.css" | head -10
   ```

2. **Network Tab'ı Kontrol Et:**
   - F12 → Network → CSS dosyaları 200 OK dönüyor mu?
   - CSS dosyaları yükleniyor mu?

3. **Console'u Kontrol Et:**
   - F12 → Console → CSS ile ilgili hata var mı?

4. **Container Loglarını Kontrol Et:**
   ```bash
   docker logs alpdinamik-app --tail 50 | grep -i "css\|error"
   ```

