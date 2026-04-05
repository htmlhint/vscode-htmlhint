const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const globals = require("globals");

const strictRules = {
  curly: "error",
  eqeqeq: "error",
  "no-var": "error",
  "prefer-const": "error",
};

module.exports = [
  {
    ignores: [
      "**/*.d.ts",
      "out/**",
      "htmlhint/out/**",
      "htmlhint-server/out/**",
      "test/out/**",
      ".vscode-test/**",
      "node_modules/**",
      "htmlhint/node_modules/**",
      "htmlhint-server/node_modules/**",
      "htmlhint/vscode-htmlhint-*.vsix",
      "**/*.vsix",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        NodeJS: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...strictRules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "error",
      "no-empty": "off",
      "no-useless-assignment": "error",
      // Disable base no-unused-vars rule for TypeScript files to prevent conflicts
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
        },
      ],
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    files: ["test/runTest.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        NodeJS: "readonly",
      },
    },
    rules: {
      ...strictRules,
      "no-console": "error",
      "no-empty": "off",
      "no-useless-assignment": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
        },
      ],
    },
  },
  {
    files: ["htmlhint/server/server.js"],
    rules: {
      curly: "off",
      eqeqeq: "off",
      "no-var": "off",
      "prefer-const": "off",
    },
  },
  prettier,
];
