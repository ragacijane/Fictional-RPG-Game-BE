FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY apps ./apps
COPY libs ./libs

RUN npm run build

# Runtime for game-api-gateway
FROM node:20-alpine AS game-api-gateway

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/apps/game-api-gateway/main.js"]

# Runtime for account microservice
FROM node:20-alpine AS account

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 3001

CMD ["sh", "-c", "npm run migration:run:account && npm run seed:account && node dist/apps/account/main.js"]

# Runtime for character microservice
FROM node:20-alpine AS character

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 3002

CMD ["sh", "-c", "npm run migration:run:character && npm run seed:character && node dist/apps/character/main.js"]

# Runtime for combat microservice
FROM node:20-alpine AS combat

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 3003

CMD ["sh", "-c", "npm run migration:run:combat && node dist/apps/combat/main.js"]