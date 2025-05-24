#!/bin/sh

if [ "$PRODUCTION" = "1" ]; then
    echo "Starting Production (Gunicorn)"
    # get migrations
    echo "Applying migrations"
    python manage.py migrate

    # get static files
    echo "Collecting static files"
    python manage.py collectstatic --noinput

    # create superuser
    # echo "Creating superuser"
    # python manage.py createsuperuser --noinput --username admin --email
    
    gunicorn realyze_backend.wsgi:application --bind 0.0.0.0:8000 --reload
else
    echo "Starting Development Server"
    python manage.py migrate
    python manage.py collectstatic --noinput
    python manage.py runserver 0.0.0.0:8000
fi