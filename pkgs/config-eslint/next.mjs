import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-config-turbo/flat";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      ".*.js",
      "eslint.config.js",
      "next.config.ts",
      "postcss.config.*",
      "prettier.config.*",
      "node_modules/",
      ".next/",
      ".turbo/",
      "out/",
      "dist/",
      "build/",
      "coverage/",
      "public/**/*.js",
      "**/*.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...turboPlugin,
  reactPlugin.configs.flat?.recommended ?? {},
  reactPlugin.configs.flat?.["jsx-runtime"] ?? {},
  {
    files: ["**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        React: true,
        JSX: true,
        process: true,
        console: true,
        Buffer: true,
        window: true,
        document: true,
      },
    },
    plugins: {
      "only-warn": onlyWarn,
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      react: reactPlugin,
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    settings: {
      react: { version: "19.0" },
    },
    rules: {
      ...(nextPlugin.configs.recommended?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
      globals: {
        React: true,
        JSX: true,
        process: true,
        console: true,
        Buffer: true,
        window: true,
        document: true,
      },
    },
    plugins: {
      "only-warn": onlyWarn,
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      react: reactPlugin,
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    settings: {
      react: { version: "19.0" },
      "import/resolver": { typescript: true },
    },
    rules: {
      ...(nextPlugin.configs.recommended?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
    },
  },
];
