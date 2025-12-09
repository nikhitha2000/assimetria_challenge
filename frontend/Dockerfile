# Build stage
FROM node:18-alpine as build

# 1. ADD THIS LINE: Declare the build argument to accept the value from docker-compose.yml
ARG REACT_APP_API_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# 2. CHANGE THIS LINE: Pass the build argument as an environment variable to the npm build command
# If REACT_APP_API_URL is unset in the shell, it uses the default (http://localhost:5000) from docker-compose.yml
RUN REACT_APP_API_URL=$REACT_APP_API_URL npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]