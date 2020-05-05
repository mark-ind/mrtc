module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    extends: [
        "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    "ignorePatterns": ["dist/"],
    rules: {
        'no-undefined': 1,
        'max-depth': [2, 2],
        'no-unneeded-ternary': 2,
        'padding-line-between-statements': [
            2,
            {
                blankLine: 'always',
                prev: 'multiline-block-like',
                next: '*',
            },
        ],
        'no-console': 2,
        'no-use-before-define': [2, { functions: false, classes: true }],
        'newline-before-return': 2,
        '@typescript-eslint/camelcase': 2,
        '@typescript-eslint/no-empty-function': 2,
        '@typescript-eslint/explicit-member-accessibility': 2,
        '@typescript-eslint/interface-name-prefix': [2, { prefixWithI: 'always' }],
    }
};