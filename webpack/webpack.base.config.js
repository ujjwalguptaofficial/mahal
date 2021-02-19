const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
const banner = require('../build_helper/licence');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [{
    name: "mahal",
    entry: "./src/index.ts",
    externals: {
        'taj-html-compiler': 'taj-html-compiler',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    mode: 'none',
    resolve: {
        extensions: ['.ts', '.js'] // '' is needed to find modules like "jquery"
    },
    plugins: [
        new SmartBannerPlugin(banner),
        new CopyPlugin({
            patterns: [
                { from: 'build_helper', to: '' },
            ],
        }),
    ],

    // optimization: {
    //     nodeEnv: false
    // },
}];