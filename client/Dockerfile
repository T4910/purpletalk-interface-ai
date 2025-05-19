FROM node:18-slim as builder

WORKDIR /app
COPY ./client/package.json ./client/pnpm-lock.yaml* ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

RUN pnpm install

COPY ./client .

# ARG VITE_BACKEND_API_URL
# ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

RUN pnpm build && \
    rm -rf node_modules  

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
