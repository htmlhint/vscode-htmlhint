# HTMLHint - Visual Studio Code Extension

VS Code extension to support HTMLHint, an HTML linter.

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/HTMLHint.vscode-htmlhint"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/HTMLHint.vscode-htmlhint"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/HTMLHint.vscode-htmlhint"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint">
    <img alt="VS Code Marketplace Ratings" src="https://img.shields.io/visual-studio-marketplace/r/HTMLHint.vscode-htmlhint"></a>
</p>

## Installation

Install through VS Code extensions. Search for `HTMLHint` and install the extension.

- [Visual Studio Code Marketplace: HTMLHint](https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint)
- [Open VSX Registry: HTMLHint](https://open-vsx.org/extension/HTMLHint/vscode-htmlhint)

Alternatively, launch VS Code Quick Open (`Ctrl`+`P`), paste the following command, and press enter.

```txt
ext install HTMLHint.vscode-htmlhint
```

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
