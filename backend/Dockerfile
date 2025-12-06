# backend/Dockerfile (production-friendly)
FROM node:18-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN chown -R appuser:appgroup /app
USER appuser
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- --timeout=3 http://localhost:5000/health || exit 1
CMD ["node", "src/index.js"]
