# Stage 1 — build the React app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first to leverage docker cache
COPY package*.json ./
# If you use yarn, replace with `yarn install`
RUN npm ci

# Copy the rest of the source and build
COPY . .
# If using create-react-app the default build output is /app/build
RUN npm run build

# Stage 2 — serve the built app with nginx
FROM nginx:stable-alpine
# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config to support client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
