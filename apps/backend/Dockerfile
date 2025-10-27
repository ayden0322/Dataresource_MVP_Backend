FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

FROM base AS dependencies

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Build
WORKDIR /app/apps/backend
RUN pnpm run build

FROM base AS production

WORKDIR /app

# Copy built files
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/node_modules ./node_modules
COPY --from=build /app/apps/backend/package.json ./

# Expose port
EXPOSE 3000

CMD ["node", "dist/main.js"]

