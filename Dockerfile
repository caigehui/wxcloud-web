FROM mirrors.wxsoft.cn/library/node:alpine as dist
LABEL stage=dist
WORKDIR /app
COPY src ./src
COPY package.json ./
COPY tsconfig.json ./
COPY .env ./
COPY .env.production ./
COPY .umirc.ts ./
COPY public ./public
RUN yarn --registry=https://registry.npm.taobao.org
RUN yarn build

FROM mirrors.wxsoft.cn/library/node:alpine as builder
LABEL stage=builder
WORKDIR /app
COPY package.json ./
COPY .npmrc ./
RUN yarn --production --registry=https://registry.npm.taobao.org

FROM mirrors.wxsoft.cn/library/pm2:12-alpine
LABEL maintainer="coffeecool<1136687@qq.com>"
LABEL wxsoft="wxboot-web"
WORKDIR /app
COPY --from=dist /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY src/webapp.ts ./src/
COPY package.json ./
COPY tsconfig.json ./
COPY .env ./
COPY .env.production ./
COPY pm2.json ./

CMD ["pm2-runtime", "pm2.json"]