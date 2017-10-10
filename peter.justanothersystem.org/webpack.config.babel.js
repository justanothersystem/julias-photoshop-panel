import webpack from 'webpack'
import path from 'path'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const javascript = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    options: {presets: [
      ['env', {
        'targets': {
          'browsers': ['last 3 versions', 'safari >= 7']
        },
        'useBuiltIns': true
      }]
    ]}
  }]
}

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins () {
      return [autoprefixer({browsers: 'last 3 versions'})]
    },
    sourceMap: true
  }
}

const styles = {
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader?sourceMap', postcss, 'sass-loader?sourceMap']
  })
}

const config = {
  entry: {
    upload: ['./peter.justanothersystem.org/assets/js/upload.js'],
    admin: ['./peter.justanothersystem.org/assets/js/panel.js']
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [javascript, styles]
  },
  plugins: [
    new webpack.DefinePlugin({
      'VERSION': JSON.stringify(process.env.npm_package_version),
      'ENVIRONMENT': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: process.env.NODE_ENV === 'development'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public', 'dist'),
    port: 9000,
    proxy: {
      '/': 'http://localhost:7777'
    },
    hot: true
  }
}

if (process.env.NODE_ENV === 'development') {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        drop_console: true
      }
    })
  )
}

module.exports = config
