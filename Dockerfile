# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port (Render will use PORT env variable)
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.cjs"]
