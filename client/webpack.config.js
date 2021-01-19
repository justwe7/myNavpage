const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩css

const isPord = process.env.NODE_ENV === 'production'

// 区分环境打包的配置，懒得新建文件了
const isMergeConf = isPord ? {} : {
  devtool: 'source-map'
}

module.exports = {
  // mode: 'production',
  ...isMergeConf,
  watch: !isPord,
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/,
    poll: 1000, // 每秒检查一次变动
  },
  entry: './client/src/main.js',
  output: {
    filename: 'js/[name].js',
    // filename: 'js/[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // hash: true,
      inject: 'body',
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      // filename: 'css/[name]-[chunkhash:8].css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + './'
              },
            },
          },
          {
            loader: 'css-loader'
          },
          { 
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // plugins: [
                //   require('autoprefixer')
                // ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|ico)$/,
        use: [{
            loader: 'url-loader', // 解决css中图片引入
            options: {//配置额外参数
                limit: 1024, //限制转base64的图片为1k(1024b)，超过1k的以url返回,设置此项需要安装依赖：file-loader，会将图片传到public下
                publicPath: '/',
                // publicPath: '/assets/',
                name: 'images/[name].[ext]'
                // name: 'images/[name]-[hash:8].[ext]'
                // outputPath: './img' //指定输出路径：放到public下的img文件下，如果没有则会自动新建,并且路片路径自动变成img/***.***
            }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, './src')],
        use: ['babel-loader', {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: true,
            fix: true,
            cache: true
          }
        }],
      },
      {
        test: /\.(htm|html)$/i,
        use: {
          loader: 'html-loader', // 解决html中的图片引入问题 -- 也可以用来玩hbs模板
          options: {
            minimize: isPord,
            attributes: true
          }
        }
      }
    ],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      // new CssMinimizerPlugin(),
    ],
  }
}
