# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY ./client ./
RUN npm install -g pnpm
RUN pnpm install --force && pnpm run build

# Stage 2: Backend
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY ./backend .

# Copy built frontend into Django static files
COPY --from=frontend-build /frontend/dist ./static/

# Expose port
EXPOSE 8000

# Add and make the startup script executable
COPY ./scripts/start-django.sh /start.sh
COPY ./scripts/fix-index-html.sh /fix-index-html.sh
RUN chmod +x /start.sh /fix-index-html.sh

RUN /fix-index-html.sh

CMD ["/start.sh"]
