# Etapa 1: build da aplicação
FROM node:23-alpine AS builder

WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Instalar dependências (dev e prod)
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript (gerar código js na pasta dist)
RUN npm run build

# Etapa 2: imagem final mais leve
FROM node:23-alpine

WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

# Comando para rodar o backend em modo desenvolvimento
CMD ["npm", "run", "dev"]
