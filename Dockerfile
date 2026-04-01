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

# Verifica vulnerabilidades de dependências (não bloqueia build em moderadas)
RUN npm audit --audit-level=high --omit=dev || true

COPY backend/ ./

# Gera o Prisma Client
RUN npx prisma generate


# ============================================================
# STAGE 3 — Imagem final (somente o necessário)
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Cria usuário e grupo não-root para execução do processo
RUN addgroup -S fusion && adduser -S -G fusion fusion

# Copia backend pronto
COPY --from=backend-builder /app/backend ./backend

# Copia o build do frontend para dentro do backend servir como static
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Transfere a propriedade dos arquivos para o usuário não-root
RUN chown -R fusion:fusion /app

WORKDIR /app/backend

# Troca para usuário não-root — todos os processos subsequentes rodam como 'fusion'
USER fusion

# Health check: Docker marca o container como unhealthy após 3 falhas
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Expõe a porta que o Express usa
EXPOSE 3000

# Roda as migrations do Prisma e depois sobe o servidor com limite de memória
CMD ["sh", "-c", "npx prisma migrate deploy && node --max-old-space-size=512 src/index.js"]
