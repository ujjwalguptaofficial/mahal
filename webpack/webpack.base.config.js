const path = require('path');
const banner = require('../build_helper/licence');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = [{
    name: "mahal",
    entry: "./src/index.ts",
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
        new webpack.BannerPlugin(banner),
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