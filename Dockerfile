# syntax=docker/dockerfile:1

# ---------- Etapa 1: build de la SPA con Node ----------
FROM node:24-alpine AS build
WORKDIR /app

# Primero solo las dependencias, para aprovechar la caché de capas
COPY package.json package-lock.json ./
RUN npm ci

# Después el código. Vite fija las variables VITE_* al compilar,
# así que acá se usa .env.production (VITE_API_BASE_URL vacío = mismo origen)
COPY . .
RUN npm run build

# ---------- Etapa 2: Nginx sin privilegios sirviendo solo dist/ ----------
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-unprivileged corre como el usuario "nginx" (uid 101) y escucha en 8080
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/ > /dev/null || exit 1
