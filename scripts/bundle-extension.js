// Bundle script for HTMLHint VS Code extension
// Usage: node scripts/bundle-extension.js

const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.join(__dirname, '../htmlhint/extension.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.join(__dirname, '../htmlhint/dist/extension.js'),
  external: [
    'vscode', // VS Code API must be external
    'fsevents', // optional native dep
  ],
  sourcemap: true,
  minify: false,
  format: 'cjs',
  logLevel: 'info',
}).catch(() => process.exit(1));
