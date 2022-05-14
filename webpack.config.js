const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = (env, options) => ({
  entry: './src/App.tsx',
  mode: options.mode === 'development' ? 'development' : 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: resolve(__dirname, './build'),
    filename: '[hash].js',
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    https: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: (_, outputParameters) => ({
        jsBundle: `${outputParameters.js[0]}`,
      }),
      template: './index.ejs',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './static', to: './' }],
    }),
  ],
  ...(options.mode === 'development' ? { devtool: 'source-map' } : null),
});

module.exports = webpackConfig;
