# frontend
FROM node:20-bookworm AS frontend

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

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