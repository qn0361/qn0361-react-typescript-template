/* eslint-disable */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv');

const now = Date.now();

module.exports = (env) => {
  const envConfig = dotenv.config({
    path: path.resolve(__dirname, env.production ? '.env.production' : '.env.local')
  });
  const parsedConfig = envConfig.parsed;
  const publicPath = parsedConfig.WEBPACK_PUBLIC_PATH || '/';

  return ({
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? false : 'source-map',
    devServer: {
      historyApiFallback: true,
      watchFiles: ['src/**/*']
    },
    entry: {
      main: path.resolve(__dirname, `./src/index.tsx`)
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: `[name].${now}.js`,
      publicPath: publicPath,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React/Typescript template',
        template: path.resolve(__dirname, './src/index.ejs'),
        filename: 'index.html',
        environment: parsedConfig,
      }),
      new ForkTsCheckerWebpackPlugin(),
      new CopyPlugin({
        patterns: [{ from: 'public', to: './' }]
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          ...parsedConfig,
          ...env,
        })
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              sourceMap: !env.production
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          include: /\.global.s[ac]ss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: env.production === false,
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.global.s[ac]ss$/,
          use: [
            "style-loader",
            "@teamsupercell/typings-for-css-modules-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: env.production === false,
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.(?:ico|gif|png|jpg|svg|jpeg|ttf|mp3|mp4)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 2 * 1024
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    }
  })
}
