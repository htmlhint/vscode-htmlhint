# Accessibility

## Our Commitment

We want the HTMLHint extension for VS Code to be usable by everyone, including people who use screen readers, keyboard navigation, high contrast themes or other assistive technologies.

The extension reports problems through VS Code's built-in diagnostics, so lint results are available in the editor, the Problems panel and the accessible diff and navigation features that VS Code provides. Several HTMLHint rules, such as `alt-require`, `button-type-require`, `frame-title-require`, `html-lang-require` and `input-requires-label`, also help you find accessibility issues in your own HTML.

## Reporting an Accessibility Issue

If you find a barrier when using the extension, or a rule that gives incorrect or unhelpful accessibility guidance, please [open an issue](https://github.com/htmlhint/vscode-htmlhint/issues/new) and include as much of the following information as possible:

- A description of the problem and how it affects you
- The extension version, VS Code version and operating system
- Any assistive technology in use, such as the screen reader and its version
- Steps to reproduce, including any sample HTML files or `.htmlhintrc` configuration
- What you expected to happen

We will review accessibility reports and prioritize fixes that block people from using the extension.

Issues with the accessibility of VS Code itself should be reported to the [VS Code repository](https://github.com/microsoft/vscode/issues). Issues with HTMLHint rules should be reported to the [HTMLHint repository](https://github.com/htmlhint/HTMLHint/issues).
