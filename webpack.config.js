const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.module\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                modules: {
                  namedExport: false,
                  localIdentName: isDev
                    ? '[name]__[local]--[hash:base64:5]'
                    : '[hash:base64]',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      ...(isDev ? [] : [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })]),
    ],
    devServer: {
      port: 3000,
      open: true,
    },
  };
};
