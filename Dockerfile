FROM node:alpine as dist
LABEL stage=dist
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
COPY .umirc.ts ./
COPY yarn.lock ./
COPY .env ./
COPY tsconfig.json ./
RUN yarn --registry=https://registry.npm.taobao.org
RUN yarn build

FROM node:alpine as builder
LABEL stage=builder
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
RUN yarn --production --registry=https://registry.npm.taobao.org

FROM keymetrics/pm2:12-alpine
LABEL maintainer="1136687@qq.com"
WORKDIR /app
COPY --from=dist /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig.json ./
COPY .env ./
COPY pm2.json ./

CMD ["pm2-runtime", "pm2.json"]