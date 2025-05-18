FROM node:18-slim as builder

WORKDIR /app

COPY ./client/package.json ./client/pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN pnpm install

COPY ./client /app/

ARG VITE_BACKEND_API_URL
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

RUN pnpm build

FROM nginx:alpine


COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]