// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import neostandard from 'neostandard'
import importPlugin from 'eslint-plugin-import'

export default [
  { ignores: ['dist', 'client/src/generated-api-client', 'client/public', 'server/.cloudflare_upload'] },
  ...storybook.configs['flat/recommended'],
  ...neostandard({
    ts: true,
    ignores: ['dist/**/*', 'types/**/*', 'docs/**/*']
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'], // any extensions you use
          moduleDirectory: ['node_modules'] // adjust if you alias
        }
        // If you use webpack or TypeScript paths, you can swap in those resolvers here
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // error on imports you can’t resolve to a file on disk
      'import/no-unresolved': ['error', {
        commonjs: true,       // also check require()
        caseSensitive: true,  // warn if file-system case doesn’t match
        // skip any import path matching these patterns:
        ignore: [
          '^cloudflare:.*$',
          '^@cloudflare/vitest-pool-workers/.*$',
          '^hono/.*$',
          '^@simplewebauthn/server/.*$',
          '^@tanstack/router-plugin/.*$',
          '^@tailwindcss/.*$'
        ]
      }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  },
  // ─── DISABLE no-unused-expressions FOR TEST FILES ─────────────────────────────
  {
    files: [
      'server/test/**/*.test.js'
    ],
    rules: {
      'no-unused-expressions': 'off'
    }
  }
]
