FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm ci --only=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/src ./src
COPY docker-entrypoint.sh ./

RUN mkdir -p uploads && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
