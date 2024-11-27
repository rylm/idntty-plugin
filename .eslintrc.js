module.exports = {
    root: true,
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    extends: ['klayr-base/ts'],
    rules: {
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        'no-console': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
    },
};
