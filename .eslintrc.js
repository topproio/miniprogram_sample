module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    globals: {
        "wx": true,
        "App": true,
        "Page": true,
        "getApp": true,
        "Component": true
    },
    "extends": "eslint:recommended",
    "root": true,
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "no-irregular-whitespace": [
            "error",
            {
                skipStrings: true,
                skipComments: false,
                skipRegExps: true,
                skipTemplates: true
            }
        ],
        "block-scoped-var": "error",
        "class-methods-use-this": "off",
        "default-case": "warn",
        "eqeqeq": [
            "error",
            "always",
            {
                "null": "ignore"
            }
        ],
        "no-eval": "error",
        "no-multi-spaces": [
            "error",
            {
                ignoreEOLComments: true,
                exceptions: {
                    Property: true,
                    BinaryExpression: false,
                    VariableDeclarator: true,
                    ImportDeclaration: true
                }
            }
        ],
        "global-require": "warn",
        "no-shadow": "off",
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "func-call-spacing": [
            "error",
            "never"
        ],
        "function-paren-newline": [
            "error",
            "never"
        ],
        "lines-around-comment": [
            "error",
            {
                // 注释上方有空行
                "beforeBlockComment": false,
                // 双斜杠注释上方有空行
                "beforeLineComment": false,
                // 类中函数注释上方有空行
                "allowClassStart": false,
            }
        ],
        "lines-between-class-members": [
            "error",
            "always"
        ],
        "new-cap": [
            "error",
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-tabs": "error",
        "space-before-function-paren": [
            "error",
            "never"
        ],
        "spaced-comment": [
            "error",
            "always"
        ],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": "off",
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};