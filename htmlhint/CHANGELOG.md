# Changelog

All notable changes to the "vscode-htmlhint" extension will be documented in this file.

### v1.15.0 (2025-11-27)

- Add autofix for the `empty-tag-not-self-closed` rule
- Smarter autofix for rules which accommodates for `tag-self-close` rule

### v1.14.0 (2025-11-26)

- Add autofix for the `attr-no-duplication` rule
- Add autofix for the `attr-value-no-duplication` rule
- Add autofix for the `form-method-require` rule

### v1.13.0 (2025-11-25)

- Update HTMLHint to v1.8.0
- Add support for [disabling rules via HTML comments](https://htmlhint.com/configuration/#disabling-rules-inline)

### v1.12.0 (2025-09-15)

- Update HTMLHint to v1.7.0

### v1.11.1 (2025-06-24)

- Add autofix for `tag-no-obsolete` rule
- Minor optimizations and code cleanup
- Reduced package size by 30%

### v1.11.0 (2025-06-20)

- Option to skip linting files ignored by `.gitignore` (`htmlhint.ignoreGitignore`).
  - When enabled, HTMLHint will not lint files or folders listed in your workspace's `.gitignore` (e.g., `node_modules/`, `dist/`, etc).
  - Enable this in VS Code settings: `HTMLHint: Ignore Gitignore`.
- Add autofix for `attr-whitespace` rule

### v1.10.2 (2025-06-19)

- Add autofix for `spec-char-escape` rule
- Add autofix for `tag-self-close` rule
- Rename extension output channel to "HTMLHint Extension" for better debugging

### v1.10.1 (2025-06-19)

- Update HTMLHint to v1.6.3

### v1.10.0 (2025-06-18)

- Update HTMLHint to v1.6.2

### v1.9.1 (2025-06-16)

- Many under the hood improvements for performance and stability
- Minor optimizations and code cleanup

### v1.9.0 (2025-06-13)

- Add command to create a `.htmlhintrc` config file
- Add autofix for `meta-description-require`
- Improved Autofixing

### v1.8.0 (2025-06-13)

- Issue IDs in problems now link to the HTMLHint rule documentation

### v1.7.0 (2025-06-13)

- Add autofix for `meta-description-require`
- Improve HTMLHint config loading
- Enable Debug Logging (check the Output > HTMLHint channel in VS Code)

### v1.6.2 (2025-06-12)

- Fix for config file not being used

### v1.6.1 (2025-06-12)

- Reduced file-size and minor optimizations

### v1.6.0 (2025-06-12)

- Add autofix for `alt-require`
- Add autofix for `attr-lowercase`
- Add autofix for `attr-no-unnecessary-whitespace`
- Add autofix for `attr-value-double-quotes`
- Add autofix for `button-type-require`
- Add autofix for `doctype-first`
- Add autofix for `doctype-html5`
- Add autofix for `html-lang-require`
- Add autofix for `meta-charset-require`
- Add autofix for `meta-viewport-require`
- Add autofix for `tag-self-close`
- Add autofix for `tagname-lowercase`
- Add autofix for `title-require`
- Many under the hood improvements for performance and stability

### v1.5.0 (2025-06-11)

- Update HTMLHint to v1.5.1

### v1.4.2 (2025-06-04)

- Fixes missing config file path option. You could now specify a custom path to your `.htmlhintrc` file in the extension settings. e.g. `"htmlhint.optionsFile": "your-project-subfolder/.htmlhintrc"`

### v1.4.1 (2025-06-04)

- Minor optimizations and code cleanup

### v1.4.0 (2025-06-03)

- Update HTMLHint to v1.4.0

### v1.3.0 (2025-06-01)

- Update HTMLHint to v1.3.0

### v1.2.0 (2025-05-30)

- Extension now can automatically validate your `.htmlhintrc` configuration file using JSON Schema (https://json.schemastore.org/htmlhint.json)

### v1.1.0 (2025-05-28)

- Migrate extension to use @types/vscode which means fewer dependencies and better compatibility with future VS Code versions

### v1.0.8 (2025-05-27)

- Update HTMLHint to v1.2.0

### v1.0.7 (2025-03-19)

- Fix build issue

### v1.0.6 (2025-03-19)

- Fix for issues appearing even when files are closed

### v1.0.5 (2023-05-17)

- Fix for activationEvents (now can be used in `markdown` and other files)
- Reduced file-size and minor optimizations

### v1.0.4 (2022-10-07)

- Reduced file-size and minor optimizations

### v1.0.3 (2022-09-21)

- Fix extension startup issue

### v1.0.2 (2022-09-21)

- Hi-DPI icon added
- Reduced file-size by 29% !

### v1.0.1 (2022-09-20)

- Reduced file-size and minor optimizations

### v1.0.0 (2022-09-15)

- Initial Release
