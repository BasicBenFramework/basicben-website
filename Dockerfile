# BasicBen website
#
# Two stages: the build stage needs devDependencies (Vite), the runtime stage
# does not. Runs on any container host — Fly, Railway, Render, Cloud Run.

# ---- build ----
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime ----
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# dist holds the built client and server. src is also needed at runtime: route
# files are auto-loaded from src/routes by scanning the filesystem, not bundled.
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/seeds ./seeds
COPY --from=build /app/basicben.config.js ./

# SQLite lives here. Mount a volume at /app/data so it survives a redeploy.
RUN mkdir -p /app/data && chown -R node:node /app/data
ENV DATABASE_URL=/app/data/database.sqlite

USER node

EXPOSE 3001

# Migrations are idempotent — they skip anything already recorded in the
# _migrations table — so running them on boot is safe.
CMD ["sh", "-c", "npx basicben migrate && node dist/server/index.js"]
