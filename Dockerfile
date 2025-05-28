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

# Install Playwright browsers (required if using playwright-python)
RUN playwright install

# Rest of your Dockerfile remains the same...
COPY ./backend .
COPY --from=frontend-build /frontend/dist ./static/
EXPOSE 8000
COPY ./scripts/start-django.sh /start.sh
COPY ./scripts/fix-index-html.sh /fix-index-html.sh
RUN chmod +x /start.sh /fix-index-html.sh
RUN /fix-index-html.sh
CMD ["/start.sh"]