# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

# Enable corepack (pnpm)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lock tru?c d? cache
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# ===== BUILD-TIME ENV (FRONTEND) =====
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

RUN pnpm build

# ---------- RUN STAGE ----------
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
