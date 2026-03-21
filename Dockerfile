# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Etapa 2: Production
FROM node:18-alpine

WORKDIR /app

# Instalar dumb-init
RUN apk add --no-cache dumb-init

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar archivos
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./
COPY --from=builder --chown=nodejs:nodejs /app/save.sql ./

USER nodejs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]