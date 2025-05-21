#!/bin/sh

# Substitute env vars and start Nginx
RUN echo 'Backend host is $BACKEND_HOST'
envsubst '$BACKEND_HOST' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/nginx.conf

nginx -g 'daemon off;'
