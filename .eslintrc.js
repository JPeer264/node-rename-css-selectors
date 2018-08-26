module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        // disabled until babel rewrite
        "strict": 1,
        "no-param-reassign": 1,
        "max-len": 1,
        "no-shadow": 1,
    }
};
