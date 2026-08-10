FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json proxy.mjs ./
RUN npm ci --omit=dev

USER node

ENTRYPOINT ["node", "proxy.mjs"]
