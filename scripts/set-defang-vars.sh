#!/bin/bash

# Path to your .env file
ENV_FILE="./backend/.env.prod"

# Check if file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env file not found!"
  exit 1
fi

# Read the file line by line
while IFS='=' read -r key value; do
  # Skip empty lines or comments
  if [[ -z "$key" || "$key" == \#* ]]; then
    continue
  fi

  # Trim whitespace and quotes
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' | xargs)

  # Run the defang config set command
  echo "🔧 Setting $key=$value"
  defang config set "$key=$value"
done < "$ENV_FILE"
