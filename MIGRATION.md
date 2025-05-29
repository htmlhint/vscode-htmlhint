# Migration from deprecated `vscode` dependency

This extension has been updated to use the recommended dependencies for VS Code extension development as per the [migration guide](https://code.visualstudio.com/api/working-with-extensions/testing-extension#migrating-from-vscode).

## Changes Made

1. Removed the deprecated `vscode` dependency and replaced it with:
   - `@types/vscode`: For type definitions
   - `vscode-test`: For testing infrastructure

2. Updated TypeScript and Node.js type definitions:
   - Updated to TypeScript ^5.4.0
   - Updated to @types/node ^20.0.0

3. Simplified build scripts:
   - Removed direct Node.js paths to TypeScript binaries
   - Removed the deprecated `postinstall` script

4. Added `dom` library to TypeScript configuration

5. Updated extension activation code:
   - Replaced deprecated `SettingMonitor` with direct `client.start()`
   - Removed unused imports

## Benefits

- Fewer dependencies
- Better compatibility with future VS Code versions
- More flexibility for testing
- Continued updates and support

For details on the migration, see: https://code.visualstudio.com/api/working-with-extensions/testing-extension#migrating-from-vscode
