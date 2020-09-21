const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
const webpack = require("webpack");

module.exports = [merge(baseConfig[0], {
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "taj.commonjs2.test.js",
        library: 'taj',
        libraryTarget: "commonjs2"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'test'",
        })
    ]
})]