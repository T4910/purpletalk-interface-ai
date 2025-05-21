FROM node:18-slim as builder

WORKDIR /app
COPY ./client/package.json ./client/pnpm-lock.yaml* ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

RUN pnpm install

COPY ./client .

RUN pnpm build && \
    rm -rf node_modules  

FROM nginx:alpine

# Use Nginx's built-in template processing
RUN rm -rf /etc/nginx/conf.d/*
COPY ./client/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html


COPY ./scripts/start-nginx.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

ENTRYPOINT ["/start.sh"]

# CMD ["nginx", "-g", "daemon off;"]