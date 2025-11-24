# Use official PHP + Nginx image that works well with Laravel on Render
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    nginx \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app code
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions (simplified)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx config
COPY conf/nginx/default.conf /etc/nginx/sites-available/default

# Expose port 10000 for Render
EXPOSE 10000

# Start script
CMD ["./scripts/start.sh"]
