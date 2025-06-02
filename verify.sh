#!/usr/bin/env bash

# Simple script to verify the extension builds and loads correctly

echo "Installing dependencies..."
cd "$(dirname "$0")" && npm install
cd "$(dirname "$0")/htmlhint" && npm install
cd "$(dirname "$0")/htmlhint-server" && npm install

echo "Building extension..."
cd "$(dirname "$0")/htmlhint-server" && npm run compile

echo "Building server..."
cd "$(dirname "$0")/htmlhint" && npm run compile

echo "Build complete."
echo "Extension is ready to be loaded in VS Code."
echo "You can test it by opening VS Code and using the 'Developer: Install Extension from Location' command."
echo "To package the extension, run 'npm run package' from the root directory."
