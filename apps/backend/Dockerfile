# Etapa 1: build da aplicação
FROM node:23-alpine AS builder

WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: imagem final mais leve
FROM node:23-alpine

WORKDIR /app

# Copiar apenas arquivos necessários da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Instalar dependências de produção no ambiente final
RUN npm install --production

# Definir variável de ambiente (ajuste conforme sua aplicação)
<<<<<<< HEAD
ENV NODE_ENV=production
=======
RUN npm install --omit=dev
>>>>>>> origin/login-register-authentication

CMD ["node", "dist/server.js"]