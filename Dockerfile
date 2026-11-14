FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY docusaurus.config.mjs sidebars.mjs ./
COPY docs ./docs
COPY src ./src
COPY i18n ./i18n

ARG DOCUSAURUS_URL=http://localhost:3000
ARG DOCUSAURUS_BASE_URL=/
ENV DOCUSAURUS_URL=${DOCUSAURUS_URL} \
    DOCUSAURUS_BASE_URL=${DOCUSAURUS_BASE_URL}

RUN npm run build

USER node
EXPOSE 3000
CMD ["./node_modules/.bin/docusaurus", "serve", "--host", "0.0.0.0", "--port", "3000", "--no-open"]
