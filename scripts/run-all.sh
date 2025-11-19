#!/usr/bin/env bash
set -euo pipefail

# Build client
pushd "$(dirname "$0")/../client" >/dev/null
if [ ! -d node_modules ]; then npm install; fi
npm run build
popd >/dev/null

# Start server (serves client/dist)
pushd "$(dirname "$0")/../server" >/dev/null
if [ ! -d node_modules ]; then npm install; fi
export PORT="${PORT:-4000}"
export MONGODB_URI="${MONGODB_URI:-mongodb://127.0.0.1:27017/fitquest}"
export JWT_SECRET="${JWT_SECRET:-local_dev_secret_change_me}"
npm start
popd >/dev/null


