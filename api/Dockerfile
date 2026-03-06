FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Force devDependencies install regardless of NODE_ENV injected by Coolify
RUN NODE_ENV=development npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM node:20-alpine
WORKDIR /app
# Copy full node_modules (includes tsx for seeding)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
COPY start.sh ./
RUN chmod +x start.sh
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./start.sh"]
