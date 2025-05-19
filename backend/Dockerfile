FROM python:3.11-slim

WORKDIR /app

COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend .

EXPOSE 8000

# Add startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Set default environment (development mode)
ENV PRODUCTION=0

CMD ["/start.sh"]
