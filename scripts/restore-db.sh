#!/bin/bash

# Database Restore Script
# This script restores a database backup

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-db.sh <backup_file.sql.gz>"
    echo "Example: ./scripts/restore-db.sh backups/alpdinamik_backup_20240101_120000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

DB_USER=${DB_USER:-alpdinamik}
DB_NAME=${DB_NAME:-alpdinamik_db}
DB_PASSWORD=${DB_PASSWORD}

echo "⚠️  WARNING: This will replace the current database!"
read -p "Are you sure you want to continue? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

echo "🔄 Restoring database from backup..."

# Check if backup is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📦 Decompressing backup..."
    gunzip -c "$BACKUP_FILE" | docker-compose -f docker-compose.prod.yml exec -T postgres \
        PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME
else
    cat "$BACKUP_FILE" | docker-compose -f docker-compose.prod.yml exec -T postgres \
        PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME
fi

echo "✅ Database restored successfully!"

