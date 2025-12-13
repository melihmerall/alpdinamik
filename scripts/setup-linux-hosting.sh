#!/bin/bash

# Linux Hosting Setup Script
# Bu script, geleneksel Linux hosting'e deployment için hazırlık yapar

set -e

echo "🚀 Linux Hosting Setup Başlatılıyor..."

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json bulunamadı. Proje dizininde olduğunuzdan emin olun."
    exit 1
fi

# Create necessary directories
echo "📁 Gerekli dizinler oluşturuluyor..."
mkdir -p public/uploads
mkdir -p backups

# Set permissions
echo "🔐 Dosya izinleri ayarlanıyor..."
chmod 755 public/uploads
chmod 644 .env* 2>/dev/null || true

# Check Node.js version
echo "📦 Node.js versiyonu kontrol ediliyor..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js versiyonu: $NODE_VERSION"
    
    # Check if version is 18+
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "⚠️  Uyarı: Node.js 18+ önerilir. Mevcut versiyon: $NODE_VERSION"
    fi
else
    echo "❌ Node.js bulunamadı. Lütfen Node.js kurun."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
    echo "⚠️  .env dosyası bulunamadı."
    if [ -f ".env.production.template" ]; then
        echo "📝 .env.production.template dosyasından .env.production oluşturuluyor..."
        cp .env.production.template .env.production
        echo "✅ .env.production oluşturuldu. Lütfen değerleri doldurun."
    fi
fi

# Check database type
if [ -f "prisma/schema.prisma" ]; then
    DB_PROVIDER=$(grep -A 2 "datasource db" prisma/schema.prisma | grep "provider" | awk '{print $2}' | tr -d '"')
    echo "🗄️  Veritabanı provider: $DB_PROVIDER"
    
    if [ "$DB_PROVIDER" = "mysql" ]; then
        echo "✅ MySQL kullanılıyor."
    elif [ "$DB_PROVIDER" = "postgresql" ]; then
        echo "✅ PostgreSQL kullanılıyor."
        echo "⚠️  Not: Eğer hosting'inizde PostgreSQL yoksa, MySQL'e geçiş yapabilirsiniz:"
        echo "   cp prisma/schema.mysql.prisma prisma/schema.prisma"
    fi
fi

# Install dependencies
echo "📦 Dependencies kuruluyor..."
if [ -f "package-lock.json" ]; then
    npm ci --production
else
    npm install --production
fi

# Generate Prisma Client
echo "🔧 Prisma Client oluşturuluyor..."
npx prisma generate

# Build Next.js
echo "🏗️  Next.js build ediliyor..."
npm run build

echo ""
echo "✅ Setup tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. .env.production dosyasını düzenleyin (DATABASE_URL, NEXTAUTH_SECRET, vb.)"
echo "2. Veritabanı migration'larını çalıştırın: npx prisma migrate deploy"
echo "3. Uygulamayı başlatın:"
echo "   - PM2 ile: pm2 start npm --name 'alpdinamik' -- start"
echo "   - veya hosting panelinden Node.js uygulamasını başlatın"
echo ""
echo "📚 Daha fazla bilgi için DEPLOYMENT-LINUX-HOSTING.md dosyasına bakın."

