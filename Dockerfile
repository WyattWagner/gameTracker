FROM node:22-alpine AS build

WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/domain/package.json packages/domain/
COPY packages/ui/package.json packages/ui/

RUN npm ci

COPY . .

RUN npm run build:prod
WORKDIR /app/apps/api
RUN npx prisma generate --schema=prisma/schema.postgres.prisma

FROM node:22-alpine AS runner

WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3001
ENV WEB_DIST_PATH=/app/apps/web/dist
ENV UPLOAD_DIR=/app/apps/api/uploads

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --from=build /app/packages/domain/package.json ./packages/domain/package.json
COPY --from=build /app/scripts/start-production.sh ./scripts/start-production.sh

RUN chmod +x ./scripts/start-production.sh

WORKDIR /app/apps/api
EXPOSE 3001

CMD ["sh", "../../scripts/start-production.sh"]
