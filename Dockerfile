FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY src ./
RUN npm install
COPY . .
FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/src ./src
CMD [  "npm", "run", "start:docker:dev" ]
