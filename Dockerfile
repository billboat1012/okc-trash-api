FROM node:22-slim

RUN apt-get update && apt-get install -y \
  chromium \
  # … (all other deps) …
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Puppeteer path fix
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

CMD ["node", "server.mjs"]
