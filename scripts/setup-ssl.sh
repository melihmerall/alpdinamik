#!/bin/bash

# SSL Certificate Setup Script for Let's Encrypt
# This script sets up SSL certificates using Certbot

set -e

DOMAIN=${1:-yourdomain.com}
EMAIL=${2:-admin@yourdomain.com}

echo "Setting up SSL certificate for domain: $DOMAIN"
echo "Email: $EMAIL"

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p /var/www/certbot

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily for initial certificate generation
echo "Stopping nginx container..."
docker-compose -f docker-compose.prod.yml stop nginx || true

# Generate certificate using standalone mode
echo "Generating SSL certificate..."
sudo certbot certonly --standalone \
    --preferred-challenges http \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive

# Copy certificates to nginx/ssl directory
echo "Copying certificates to nginx/ssl..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/privkey.pem
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem

# Update nginx config with domain name
echo "Updating nginx configuration..."
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/conf.d/default.conf

echo "SSL certificate setup completed!"
echo "Don't forget to:"
echo "1. Update .env.production with your domain"
echo "2. Update nginx/conf.d/default.conf with your domain"
echo "3. Restart the nginx container: docker-compose -f docker-compose.prod.yml restart nginx"

# Setup auto-renewal
echo "Setting up auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "SSL setup complete!"

