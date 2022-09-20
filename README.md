# HTMLHint - VS Code Extension

VS Code extension to support HTMLHint, an HTML linter.

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/HTMLHint.vscode-htmlhint"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/HTMLHint.vscode-htmlhint"></a>
  <a href="https://twitter.com/htmlhint">
    <img alt="Follow HTMLHint on Twitter" src="https://img.shields.io/twitter/follow/htmlhint.svg?label=follow+htmlhint&style=flat-square"></a>
</p>

## Development setup

- run `npm install` inside the `htmlhint` and `htmlhint-server` folders
- open VS Code on `htmlhint` and `htmlhint-server`

## Developing the server

- open VS Code on `htmlhint-server`
- run `npm run compile` or `npm run watch` to build the server and copy it into the `htmlhint` folder
- to debug press F5 which attaches a debugger to the server

## Developing the extension/client

- open VS Code on `htmlhint`
- run F5 to build and debug the extension

## Building the Extension

- run `vsce package` in extension root folder to create the VSIX file.
