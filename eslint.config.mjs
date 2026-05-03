import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      eqeqeq: ['error', 'always'],
      'default-param-last': ['error'],
      'no-var': 'error',
      'no-duplicate-imports': 'warn',
    },
  },
  eslintConfigPrettier,
]);
