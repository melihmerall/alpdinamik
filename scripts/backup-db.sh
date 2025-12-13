#!/bin/bash

# Database Backup Script
# This script creates a backup of the PostgreSQL database

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/alpdinamik_backup_$TIMESTAMP.sql"

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

DB_USER=${DB_USER:-alpdinamik}
DB_NAME=${DB_NAME:-alpdinamik_db}
DB_PASSWORD=${DB_PASSWORD}

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🗄️  Creating database backup..."

# Create backup using pg_dump
docker-compose -f docker-compose.prod.yml exec -T postgres \
    PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Compress backup
echo "📦 Compressing backup..."
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ Backup created successfully!"
echo "📁 Backup file: $BACKUP_FILE"
echo "📊 Backup size: $BACKUP_SIZE"

# Keep only last 7 days of backups
echo "🧹 Cleaning old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "alpdinamik_backup_*.sql.gz" -mtime +7 -delete

echo "✨ Backup process completed!"

