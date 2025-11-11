# Multi-stage Dockerfile for Laravel production deployment
#  - Stage 1: install composer dependencies (no-dev) using the official composer image
#  - Stage 2: build a slim PHP-FPM image with required extensions and copy application + vendor

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Install production dependencies into /app/vendor
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-plugins --no-scripts

FROM php:8.2-fpm-alpine

# system deps and build dependencies for building extensions
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    icu-dev \
    libxml2-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zlib-dev \
    oniguruma-dev \
    bash \
    git \
    openssh \
    zip \
    unzip \
    && apk add --no-cache --update libpng libjpeg-turbo libwebp zlib icu-dev

# Configure and install PHP extensions commonly required by Laravel
RUN docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo pdo_mysql mbstring exif pcntl bcmath gd intl xml opcache \
    && pecl install redis || true \
    && docker-php-ext-enable redis || true

# Cleanup build dependencies
RUN apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

WORKDIR /var/www/html

# Copy vendor from the composer stage
COPY --from=vendor /app/vendor ./vendor

# Copy application files
COPY . .

# Ensure permissions for storage & bootstrap cache (may be overridden at run-time)
RUN set -eux \
    && mkdir -p storage/framework storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache || true \
    && chmod -R 755 storage bootstrap/cache || true

# Expose an HTTP port Render can detect
EXPOSE 8000

# Start PHP built-in web server so Render's port scan detects an HTTP listener.
# For small deployments this is sufficient; for production you may prefer nginx + php-fpm.
CMD ["sh", "-lc", "php -S 0.0.0.0:8000 -t public public/index.php"]
