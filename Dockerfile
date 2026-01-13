FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm ci

COPY --from=development /app/dist ./dist
COPY --from=development /app/src ./src
COPY --from=development /app/node_modules/.bin ./node_modules/.bin
COPY docker-entrypoint.sh ./

RUN mkdir -p uploads && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
