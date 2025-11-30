# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies
RUN npm install

# Build the project (both client and server)
# This runs script/build.ts which builds Vite + esbuild
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only package files from source
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.cjs"]
