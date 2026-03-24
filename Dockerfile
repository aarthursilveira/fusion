# ============================================================
# STAGE 1 — Build do Frontend (React + Vite)
# ============================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build
# Resultado: /app/frontend/dist


# ============================================================
# STAGE 2 — Build do Backend (Node + Prisma)
# ============================================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Gera o Prisma Client
RUN npx prisma generate


# ============================================================
# STAGE 3 — Imagem final (somente o necessário)
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copia backend pronto
COPY --from=backend-builder /app/backend ./backend

# Copia o build do frontend para dentro do backend servir como static
COPY --from=frontend-builder /app/frontend/dist ./backend/public

WORKDIR /app/backend

# Expõe a porta que o Express usa
EXPOSE 3000

# Roda as migrations do Prisma e depois sobe o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
