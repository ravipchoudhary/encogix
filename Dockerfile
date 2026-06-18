# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all files
COPY package*.json ./
COPY prisma/ ./prisma/
COPY frontend/ ./frontend/
COPY backend/ ./backend/ 2>/dev/null || true
COPY lib/ ./lib/
COPY server.js .

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npm run postinstall

# Build Next.js frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start server
CMD ["node", "server.js"]
