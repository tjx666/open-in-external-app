const { resolve } = require;
const OFF = 0;
const WARN = 1;

module.exports = {
    env: {
        browser: true,
        es2022: true,
        node: true,
        mocha: true,
    },
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.tsx', '.js', '.json'],
            },
            typescript: {
                project: [resolve('./tsconfig.json'), resolve('./scripts/tsconfig.json')],
            },
        },
    },
    rules: {
        'prettier/prettier': OFF,

        'import/extensions': OFF,
        'import/no-unresolved': [WARN, { ignore: ['vscode'] }],

        '@typescript-eslint/ban-ts-comment': OFF,
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,

        'func-names': OFF,
        'lines-between-class-members': OFF,
        'no-bitwise': OFF,
        'no-console': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-unused-expressions': OFF,
        'no-restricted-syntax': OFF
    },
    overrides: [
        {
            files: ['test/**/*.ts'],
            rules: {
                'import/prefer-default-export': OFF,
            },
        },
        {
            files: ['scripts/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': OFF,
            },
        },
    ],
};
