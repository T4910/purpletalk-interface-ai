#!/bin/sh
cd "$(dirname "$0")/.." || exit 1
exec docker compose --env-file ./backend/.env.dev -f docker-compose.dev.yml up --build --menu