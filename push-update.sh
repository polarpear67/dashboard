#!/bin/bash
# Push daily news update to GitHub Pages
# Usage: push-update.sh <date> "<json_news_data>"

cd "$(dirname "$0")"

DATE="$1"
JSON_DATA="$2"

if [ -z "$DATE" ] || [ -z "$JSON_DATA" ]; then
    echo "Usage: push-update.sh YYYY-MM-DD '<json_array>'"
    exit 1
fi

# Update the main news.json data file
# Merge today's data into existing data
CURRENT_DATA=$(cat data/news.json 2>/dev/null || echo "{}")
MERGED=$(echo "$CURRENT_DATA" | node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
data['$DATE'] = $JSON_DATA;
fs.writeFileSync('data/news.json', JSON.stringify(data, null, 2));
console.log('Merged');
")
echo "$MERGED"

# Generate the static daily page
node generate-daily.js "$DATE"

# Configure git
git config user.name "Polar 🐻‍❄️"
git config user.email "polar@daily-news-bot"

# Commit and push
git add -A
git commit -m "📰 Daily news update - $DATE"
git push origin main

echo "✅ Published news for $DATE"
