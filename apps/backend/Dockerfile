# Step 1: Build the application
FROM node:23-alpine AS builder

WORKDIR /app

# Copy project files
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Install dependencies (dev and prod)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript (output JS code to the dist folder)
RUN npm run build

# Step 2: Final lightweight image
FROM node:23-alpine

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

# Command to run the backend in development mode
CMD ["npm", "run", "dev"]
