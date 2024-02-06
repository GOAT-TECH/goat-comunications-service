FROM node:20-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache procps libc6-compat
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
RUN npm install 

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

EXPOSE 6000
EXPOSE 80
COPY --from=deps /app/node_modules ./node_modules