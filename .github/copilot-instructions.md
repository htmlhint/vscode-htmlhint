# Copilot Instructions

- This project is the HTMLHint Visual Studio Code extension. It is a linter for HTML files that helps developers write clean and error-free HTML code. The extension provides real-time feedback and suggestions for improving HTML code quality.
- Code is linted with ESLint v8.57.1.
- All code is formatted with Prettier.
- All code and comments are in US English.
- We use TypeScript v5.5.4.

## GitHub Actions

- The GitHub Actions workflows should be placed in the .github/workflows directory.
- The workflows should be named <workflow-name>.yml.
- All GitHub Actions should be pinned versions to avoid breaking changes (SHA-1).
- If using actions/checkout, it should have persist-credentials: false set.
