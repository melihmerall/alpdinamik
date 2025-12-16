#!/bin/bash

# Multi-Site Deployment Script for Alp Dinamik
# Her site için ayrı port ve klasör yapısı

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Site bilgileri
SITE_NAME="alpdinamik"
SITE_PORT="3001"  # Her site için farklı port
BASE_DIR="/var/www"
SITE_DIR="$BASE_DIR/$SITE_NAME"

echo -e "${BLUE}🚀 Multi-Site Deployment: $SITE_NAME${NC}"
echo -e "${YELLOW}📍 Port: $SITE_PORT${NC}"
echo ""

# 1. Sistem güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y

# 2. Docker kurulumu
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Docker kuruluyor...${NC}"
    apt install -y docker.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✅ Docker kuruldu${NC}"
else
    echo -e "${GREEN}✅ Docker zaten kurulu${NC}"
fi

# 3. Git kurulumu
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Git kuruluyor...${NC}"
    apt install -y git
    echo -e "${GREEN}✅ Git kuruldu${NC}"
else
    echo -e "${GREEN}✅ Git zaten kurulu${NC}"
fi

# 4. Proje klasörü oluştur
echo -e "${YELLOW}📁 Proje klasörü oluşturuluyor: $SITE_DIR${NC}"
mkdir -p $SITE_DIR
cd $SITE_DIR

# 5. Environment variables oluştur
if [ ! -f "$SITE_DIR/.env.production" ]; then
    echo -e "${YELLOW}⚙️  .env.production dosyası oluşturuluyor...${NC}"
    
    # Güvenli şifre oluştur
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    cat > $SITE_DIR/.env.production << EOF
# Site Configuration
SITE_NAME=$SITE_NAME
SITE_PORT=$SITE_PORT

# Database Configuration
DB_USER=${SITE_NAME}_user
DB_PASSWORD=$DB_PASSWORD
DB_NAME=${SITE_NAME}_db
DB_PORT=5432

# Database URL (Docker internal)
DATABASE_URL=postgresql://${SITE_NAME}_user:$DB_PASSWORD@${SITE_NAME}-postgres:5432/${SITE_NAME}_db?schema=public&connection_limit=20&pool_timeout=20

# NextAuth Configuration
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://[SERVER_IP]:$SITE_PORT

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://[SERVER_IP]:$SITE_PORT
NODE_ENV=production

# Application Port
APP_PORT=3000
EOF
    echo -e "${GREEN}✅ .env.production oluşturuldu${NC}"
    echo -e "${YELLOW}📝 Database Password: $DB_PASSWORD${NC}"
    echo -e "${YELLOW}📝 NextAuth Secret: $NEXTAUTH_SECRET${NC}"
else
    echo -e "${GREEN}✅ .env.production zaten mevcut${NC}"
fi

# 6. Docker Compose dosyasını site'e özel hale getir
if [ ! -f "$SITE_DIR/docker-compose.prod.yml" ]; then
    echo -e "${YELLOW}🐳 Docker Compose dosyası oluşturuluyor...${NC}"
    cat > $SITE_DIR/docker-compose.prod.yml << 'COMPOSE_EOF'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${SITE_NAME}-postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - ${SITE_NAME}-postgres-data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ${SITE_NAME}-network
    restart: unless-stopped

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${SITE_NAME}-app
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NODE_ENV: production
    ports:
      - "${SITE_PORT}:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - ${SITE_NAME}-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  ${SITE_NAME}-postgres-data:
    driver: local

networks:
  ${SITE_NAME}-network:
    driver: bridge
COMPOSE_EOF
    echo -e "${GREEN}✅ Docker Compose dosyası oluşturuldu${NC}"
fi

echo -e "${GREEN}✅ Deployment hazırlığı tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📝 Sonraki adımlar:${NC}"
echo "   1. Projeyi $SITE_DIR klasörüne aktarın"
echo "   2. Database dump'ını import edin (eğer varsa)"
echo "   3. docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build"
echo ""
echo -e "${BLUE}🌐 Site erişim adresi: http://[SERVER_IP]:$SITE_PORT${NC}"

