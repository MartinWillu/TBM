FROM node:24-alpine AS builder
WORKDIR /app

ENV FRONTEND_PORT=${FRONTEND_PORT:-80}

COPY package.json .
COPY package-lock.json* .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE $FRONTEND_PORT
CMD ["nginx", "-g", "daemon off;"]