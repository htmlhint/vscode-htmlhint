#!/usr/bin/env bash

# Simple script to verify the extension builds and loads correctly

echo "Building extension..."
cd "$(dirname "$0")/htmlhint" && npm run compile

echo "Building server..."
cd "$(dirname "$0")/htmlhint-server" && npm run compile

echo "Build complete."
echo "Extension is ready to be loaded in VS Code."
echo "You can test it by opening VS Code and using the 'Developer: Install Extension from Location' command."
