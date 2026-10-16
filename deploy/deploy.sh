#!/usr/bin/env bash
# Ship this working tree to the VPS, rebuild the image there and restart the
# container. Usage: deploy/deploy.sh  (DEPLOY_HOST / DEPLOY_DIR to override)
set -euo pipefail

HOST="${DEPLOY_HOST:-makineo-cmd}"
DIR="${DEPLOY_DIR:-/opt/portfolio}"
cd "$(dirname "$0")/.."

npm test
npm run lint

rsync -az --delete \
  --exclude=node_modules --exclude=.next --exclude=.git --exclude=.claude \
  --exclude=.playwright-mcp --exclude=context --exclude='*.tsbuildinfo' --exclude=coverage \
  --exclude=.tunnel-token \
  ./ "$HOST:$DIR/"

ssh "$HOST" "cd $DIR && docker compose -f docker-compose.prod.yml up -d --build \
  && sleep 10 && curl -fsS -o /dev/null -w 'portfolio-web: %{http_code}\n' http://127.0.0.1:3020/"
