# syntax=docker/dockerfile:1

# ── Build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk upgrade --no-cache && apk add --no-cache libc6-compat

# Dev dependencies are needed to build (TypeScript, Tailwind, React Compiler).
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Runtime: only the standalone server, as an unprivileged user ─────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk upgrade --no-cache && apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", "server.js"]
