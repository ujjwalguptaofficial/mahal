const webpack = require("webpack");
const path = require("path");
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        frameworks: ["mocha", 'chai'],
        // plugins: ['karma-chai'],
        files: [
            // "src/**/*.ts",
            "test/**/*.ts" // *.tsx for React Jsx
        ],
        preprocessors: {
            "**/*.ts": "webpack",
            "**/*.js": "webpack"
        },
        webpack: {
            module: {
                rules: [{
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js']
            },
            output: {
                filename: 'bundle.js',
                path: path.resolve(__dirname, 'bin/')
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                })
            ]
        },
        reporters: ["mocha"],
        // browsers: ["jsdom"],
        browsers: ['HeadlessChrome'],
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--headless',
                    '--disable-gpu',
                    '--disable-translate',
                    '--disable-extensions'
                ]
            }
        },
        singleRun: false,
        concurrency: Infinity
    });
};