const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

const libraryTarget = [{
    type: "var",
    name: 'mahal.min.js'
}, {
    type: "commonjs2",
    name: 'mahal.min.commonjs2.js'
}];

function getConfigForTaget(target) {
    return {
        mode: 'production',
        output: {
            path: path.join(__dirname, "../dist"),
            filename: target.name,
            library: target.type === 'var' ? 'mahal' : undefined,
            libraryTarget: target.type
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': "'production'",
            }),
            ...(
                target.type === 'var' ?
                    [new CompressionPlugin({
                        test:/mahal/
                    })] :
                    []
            )
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