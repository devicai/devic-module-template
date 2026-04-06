# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ ./src/

RUN yarn build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=builder /app/dist ./dist

EXPOSE 3100

CMD ["node", "dist/main.js"]
