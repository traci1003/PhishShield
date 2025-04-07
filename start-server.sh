#!/bin/bash

# Ensure we have a clean start
echo "Stopping any existing Node.js processes..."
pkill -f "tsx server/index.ts" || true
pkill -f "node" || true

# Wait for processes to fully terminate
sleep 2

# Start the server with explicit port notification
echo "Starting PhishShield AI server..."
PORT=5000 NODE_ENV=development npx tsx server/index.ts