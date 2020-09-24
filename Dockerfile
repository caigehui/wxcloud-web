FROM node:alpine as builder
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
COPY yarn.lock ./
RUN yarn --production --registry=https://registry.npm.taobao.org

FROM keymetrics/pm2:12-alpine
LABEL maintainer="1136687@qq.com"
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./
COPY package.json ./
COPY .env ./
COPY pm2.json ./