# frontend-dev
FROM node:20-bookworm AS frontend-dev

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# frontend build stage
FROM node:20-bookworm AS frontend-build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# frontend production stage
FROM nginx:alpine AS frontend

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Budowa backendu
FROM node:20-bookworm AS backend
WORKDIR /app

# narzedzia potrzebne do kompilacji natywnej modulow (sqlite3), docker
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        make \
        g++ \
        docker.io && \
    rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

# natywna kompilacja modulu
RUN npm ci --omit=dev --build-from-source

COPY backend/ .

RUN mkdir -p /home/data
RUN mkdir -p /app/temp

EXPOSE 3000
CMD ["node", "server.js"]