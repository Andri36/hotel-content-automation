# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies
RUN npm install

# Build server only (frontend is deployed separately on Firebase)
RUN npx tsx script/build-server.ts

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json for reference
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
