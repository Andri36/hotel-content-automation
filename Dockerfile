# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build server only (skip Vite/client build)
RUN npx tsx script/build-server.ts

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built server from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.cjs"]
