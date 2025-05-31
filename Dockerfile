# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY ./client ./
RUN npm install -g pnpm
RUN pnpm install --force && pnpm run build

# Stage 2: Backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Playwright browsers
# Install Python dependencies
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright and browsers
RUN pip install playwright
RUN python -m playwright install --with-deps chromium

# Copy backend and frontend files
COPY ./backend ./
COPY --from=frontend-build /frontend/dist ./static/

# Setup scripts
COPY ./scripts/start-django.sh /start.sh
COPY ./scripts/fix-index-html.sh /fix-index-html.sh
RUN chmod +x /start.sh /fix-index-html.sh
RUN /fix-index-html.sh

EXPOSE 8000
CMD ["/start.sh"]
