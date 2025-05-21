
#!/bin/sh
cd "$(dirname "$0")/.." || exit 1
exec ./scripts/set-defang-vars.sh
exec defang compose up