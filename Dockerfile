FROM node:25.8.1-alpine

WORKDIR /app

# Dependencias sistema para Next.js
RUN apk add --no-cache libc6-compat

# Copiamos package.json y lock (YA EXISTEN)
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Puerto Next.js
EXPOSE 3000

# Dev mode
CMD ["npm", "run", "dev"]
