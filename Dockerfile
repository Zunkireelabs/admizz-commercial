# Stage 1: Build the static site
FROM node:22-alpine AS builder
WORKDIR /app

# Drives the noindex meta tag + GA gating in src/_data/env.js / base.njk.
# docker-compose.dev.yml passes "staging" (-> noindex, no GA); docker-compose.yml passes
# "production". Never hardcode this in package.json's build script — see CLAUDE.md.
ARG ELEVENTY_ENV=production
ENV ELEVENTY_ENV=$ELEVENTY_ENV

COPY package.json package-lock.json ./
RUN npm ci

COPY src/ src/
COPY public/ public/
COPY .eleventy.js tailwind.config.js postcss.config.js ./

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/static.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
