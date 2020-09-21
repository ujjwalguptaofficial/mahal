const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
const webpack = require("webpack");

const libraryTarget = [{
    type: "var",
    name: 'taj.js'
}, {
    type: "commonjs2",
    name: 'taj.commonjs2.js'
}];

function getConfigForTaget(target) {
    return {
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "../dist"),
            filename: target.name,
            library: 'taj',
            libraryTarget: target.type
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': "'development'",
            })
        ]
    }
}

function createConfigsForAllLibraryTarget() {
    var configs = [];
    libraryTarget.forEach(function (target) {
        configs.push(merge(baseConfig[0], getConfigForTaget(target)));
    })
    return configs;
}

module.exports = [...createConfigsForAllLibraryTarget()]