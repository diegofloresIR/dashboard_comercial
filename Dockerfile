# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite frontend
RUN npm run build

# Build the TypeScript backend (if needed, otherwise tsx handles it or we can compile it)
# For production, it's better to compile server.ts to JS, but for simplicity, we can use tsx or compile
RUN npm run lint || true

# Production stage
FROM node:20

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy backend files
COPY server.ts ./
COPY tsconfig.json ./

# Install tsx globally or locally to run the server
RUN npm install -g tsx

# Expose port
EXPOSE 3000

# Set environment variables (these should be overridden in Portainer)
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["tsx", "server.ts"]
