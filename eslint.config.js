/* eslint-env node */
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([{
  files: ["**/*.ts"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  }
}]);
