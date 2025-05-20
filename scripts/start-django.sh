#!/bin/sh

if [ "$PRODUCTION" = "1" ]; then
    echo "Starting Production (Gunicorn)"
    exec gunicorn realyze_backend.wsgi:application --bind 0.0.0.0:8000 --reload
else
    echo "Starting Development Server"
    exec python manage.py runserver 0.0.0.0:8000
fi