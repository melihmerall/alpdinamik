#!/bin/bash

# Production Deployment Script
# This script builds and deploys the application to production

set -e

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy .env.production.example to .env.production and fill in the values."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p nginx/conf.d
mkdir -p public/uploads
mkdir -p backups

# Check if SSL certificates exist
if [ ! -f nginx/ssl/fullchain.pem ] || [ ! -f nginx/ssl/privkey.pem ]; then
    echo "⚠️  Warning: SSL certificates not found!"
    echo "Please run: ./scripts/setup-ssl.sh yourdomain.com your@email.com"
    echo "Or place your SSL certificates in nginx/ssl/ directory"
    read -p "Continue without SSL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Pull latest code (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest code..."
    git pull origin main || git pull origin master || true
fi

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database exists and has data
echo "🔍 Veritabanı durumu kontrol ediliyor..."
DB_EXISTS=$(docker-compose -f docker-compose.prod.yml exec -T postgres psql -U ${DB_USER:-alpdinamik} -lqt 2>/dev/null | cut -d \| -f 1 | grep -w ${DB_NAME:-alpdinamik_db} | wc -l || echo "0")

if [ "$DB_EXISTS" = "0" ] || [ -z "$DB_EXISTS" ]; then
    echo "📦 Yeni veritabanı oluşturuluyor..."
    # Run database migrations
    echo "🗄️  Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy || \
    docker-compose -f docker-compose.prod.yml exec -T app npx prisma db push --accept-data-loss

    # Check if seed is needed (optional)
    read -p "Run database seed? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        docker-compose -f docker-compose.prod.yml exec -T app npm run db:seed || true
    fi
else
    echo "✅ Veritabanı mevcut. Migration'lar çalıştırılıyor..."
    docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy || true
    echo "ℹ️  Mevcut veriler korunacak. Yeni migration'lar uygulanacak."
fi

# Show container status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop: docker-compose -f docker-compose.prod.yml down"
echo "  Restart: docker-compose -f docker-compose.prod.yml restart"

