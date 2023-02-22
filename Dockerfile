FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
ENV PORT=4000
VOLUME [ "/src" ]
EXPOSE $PORT
CMD [  "npm", "run", "start:migrate:prod" ]
