#!/bin/sh

cd "$(dirname "$0")/.." || exit 1

# Default to development mode
PRODUCTION=0

# Parse arguments
for arg in "$@"; do
    if [ "$arg" = "--prod" ]; then
        PRODUCTION=1
        break
    fi
done

# Execute the script to set other Defang variables
./scripts/set-defang-vars.sh

# Set the PRODUCTION variable in Defang configuration
defang config set PRODUCTION=$PRODUCTION

# Bring up the Docker Compose services
defang compose -f docker-compose.dev.yml up
