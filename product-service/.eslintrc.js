module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
};
