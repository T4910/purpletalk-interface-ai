
#!/bin/sh
cd "$(dirname "$0")/.." || exit 1
exec ./scripts/set-defang-vars.sh
exec defang config set OPENAI_API_KEY --random
exec defang config set SECRET_KEY --random
exec defang compose up