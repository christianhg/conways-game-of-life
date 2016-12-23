module.exports = {
  devServer: {
    colors: true,
    contentBase: '.',
    inline: true,
    port: 3000
  },
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'ramda-loader'
      }
    ]
  }
}
