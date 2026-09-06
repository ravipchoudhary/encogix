# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all files
COPY package*.json ./
COPY app/ ./app/
COPY components/ ./components/
COPY public/ ./public/
COPY next.config.mjs next-env.d.ts tsconfig.json postcss.config.js tailwind.config.js ./
COPY schema.sql setup.js seed.js ./
COPY lib/ ./lib/
COPY server.js .

# Install dependencies
RUN npm ci

# Build Next.js frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
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
