var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');

module.exports = {
    target: 'node', // webpack should compile node compatible code
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.css?$/,
            use: ['style-loader', 'css-loader'],
            // exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'test'"
        })
    ],
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};