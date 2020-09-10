const webpackConfig = require("./webpack.config");
module.exports = function (config) {
    config.set({
        frameworks: ["mocha", "karma-typescript"],
        files: [
            "src/**/*.ts",
            "test/**/*.ts" // *.tsx for React Jsx
        ],
        preprocessors: {
            "**/*.ts": "webpack" // *.tsx for React Jsx
        },
        webpack: webpackConfig,
        // reporters: ["progress"],
        browsers: ["Chrome"]
    });
};