const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
module.exports = {
  entry: path.join(__dirname, './src/index.ts'),
  devtool: 'source-map',
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'bin/')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebPackPlugin({
      cache: true,
      hash: true,
      template: path.join(__dirname, './src/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    })
  ]
};