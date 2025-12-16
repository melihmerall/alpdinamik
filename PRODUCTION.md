# Production Deployment Guide

## Production Optimizations Applied

### 1. Next.js Configuration
- Image optimization with AVIF/WebP formats
- Long-term caching (1 year for images)
- Production source maps disabled
- Font optimization enabled
- ETags generation enabled

### 2. Database Optimizations
- Connection pooling configured (20 connections)
- Performance indexes added to schema
- Query optimization with `select` statements
- API response caching implemented

### 3. Performance Improvements
- Lazy loading for heavy components
- Image preloading for above-the-fold content
- Parallel API calls
- Lightweight API endpoints

### 4. Docker Production Setup

#### Build Production Image
```bash
docker build -t alpdinamik-prod -f Dockerfile .
```

#### Run with Docker Compose
```bash
# Copy .env.production.example to .env.production and configure
cp .env.production.example .env.production

# Start production services
npm run docker:prod

# View logs
npm run docker:logs:prod

# Stop services
npm run docker:prod:down
```

### 5. Environment Variables

Required environment variables for production:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- `NEXTAUTH_URL` - Your production domain
- `NEXT_PUBLIC_API_URL` - Your production API URL
- `NODE_ENV=production`

### 6. Database Migration

Before starting production:
```bash
# Run migrations
npm run db:migrate:prod
```

### 7. Health Check

Health check endpoint available at: `/api/health`

### 8. Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Build production image
- [ ] Test health check endpoint
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up SSL certificates
- [ ] Configure domain DNS
- [ ] Test all critical paths
- [ ] Monitor logs and performance

