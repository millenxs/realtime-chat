# Etapa 1: build
FROM node:23-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: execução
FROM node:23-alpine

WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
