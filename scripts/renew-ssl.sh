#!/bin/bash

# SSL Certificate Renewal Script
# This script renews SSL certificates and reloads nginx

set -e

DOMAIN=${1:-yourdomain.com}

echo "Renewing SSL certificate for domain: $DOMAIN"

# Renew certificate
sudo certbot renew --quiet

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/privkey.pem
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem

# Reload nginx
echo "Reloading nginx..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "SSL certificate renewed successfully!"

