#!/bin/sh

start_qcluster() {
    echo "Starting Django Q2 cluster..."
    python manage.py qcluster &
}

if [ "$PRODUCTION" = "1" ]; then
    echo "Starting Production (Gunicorn)"

    # Apply migrations
    echo "Applying migrations"
    python manage.py migrate

    # Collect static files
    echo "Collecting static files"
    python manage.py collectstatic --noinput

    # Optionally create a superuser
    # echo "Creating superuser"
    # python manage.py createsuperuser --noinput --username admin --email

    # Start Django Q2
    start_qcluster

    # Start Gunicorn with production tuning
    echo "Starting Gunicorn..."
    gunicorn realyze_backend.wsgi:application \
      --bind 0.0.0.0:8000 \
      --workers "${GUNICORN_WORKERS:-4}" \
      --timeout "${GUNICORN_TIMEOUT:-60}" \
      --graceful-timeout "${GUNICORN_GRACEFUL_TIMEOUT:-30}" \
      --keep-alive "${GUNICORN_KEEP_ALIVE:-5}"
else
    echo "Starting Development Server"

    python manage.py migrate
    python manage.py collectstatic --noinput

    # Start Django Q2
    # start_qcluster

    # Start Django's dev server
    python manage.py runserver 0.0.0.0:8000
fi
