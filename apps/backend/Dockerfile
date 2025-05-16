# Etapa 1: build da aplicação
FROM node:23-alpine AS builder

WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Instalar dependências (todas, incluindo dev)
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: imagem final mais leve
FROM node:23-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Instalar apenas dependências de produção
RUN npm install --omit=dev

# Definir comando padrão
CMD ["node", "dist/server.js"]
