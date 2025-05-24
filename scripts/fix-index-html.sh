#!/bin/sh
# filepath: /workspaces/purpletalk-interface-ai/scripts/fix-index-html.sh

INDEX_HTML="./static/index.html"

# Add {% load static %} at the top if not present
if ! grep -q "{% load static %}" "$INDEX_HTML"; then
  sed -i '1s;^;{% load static %}\n\n;' "$INDEX_HTML"
fi

# Replace src="/assets/..." and href="/assets/..." with Django static tag
sed -i -E 's/(src|href)="\/assets\/([^"]+)"/\1={% static "\/assets\/\2" %}/g' "$INDEX_HTML"