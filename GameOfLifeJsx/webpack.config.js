const webpack = require('webpack');
const path = require('path');

module.exports = {
  // set this to your entry point
    entry: { main: './src/js/app.jsx' },

  // change this to your output path
  output: {
      filename: "./wwwroot/js/app.js",
    publicPath: "/wwwroot/"
  },

  // create a map file for debugging
  //devtool: 'source-map',

  resolve: {
      extensions: ['.js', '.jsx']
  },

  // configure the loaders
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015', 'react'],
          compact: false,
          plugins: [require('babel-plugin-transform-es2015-computed-properties')]
        }
      },
      {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
      }
    ]
  },

  ///////////  uncomment this for production ////////////////
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new webpack.DefinePlugin({
  //     'process.env': {'NODE_ENV': JSON.stringify('production')}
  //   })
  // ],////////////////////////////////////////////////////////

  watch: false // change this to true to keep webpack running
};

