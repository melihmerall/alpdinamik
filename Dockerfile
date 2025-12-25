# Multi-stage build for Next.js Production
FROM node:20-alpine AS base

# Install dependencies including OpenSSL for Prisma
RUN apk add --no-cache libc6-compat openssl openssl-dev

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies for Prisma CLI)
RUN npm ci && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (Prisma devDependencies'de olduğu için node_modules'de olmalı)
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
# Public klasörünü hem root'a hem standalone'a kopyala (Next.js standalone build için)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Standalone build'de public klasörü de olmalı
RUN if [ -d "/app/.next/standalone/public" ]; then \
      echo "Standalone public klasörü zaten mevcut"; \
    else \
      mkdir -p /app/.next/standalone/public && \
      cp -r /app/public/* /app/.next/standalone/public/ 2>/dev/null || true; \
    fi
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy Prisma CLI from builder stage (already installed there)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
# Copy Prisma binary symlink
RUN mkdir -p ./node_modules/.bin && \
    ln -sf ../prisma/build/index.js ./node_modules/.bin/prisma 2>/dev/null || \
    ln -sf ../prisma/cli/index.js ./node_modules/.bin/prisma 2>/dev/null || true && \
    chown -R nextjs:nodejs ./node_modules/.bin

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]

