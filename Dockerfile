# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Upgrade Alpine packages to patch CVE-2026-22184 (zlib) and others
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Upgrade Alpine packages to patch CVE-2026-22184 (zlib) and others
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
