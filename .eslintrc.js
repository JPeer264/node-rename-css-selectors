module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-base'
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-dupe-class-members': 'off',
            },
        },
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            allowTypedFunctionExpressions: true,
            allowExpressions: true,
        }],
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            ts: 'never',
        }],
    }
};
