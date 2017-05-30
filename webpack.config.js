var nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: [
    './src/main.ts'
  ],
  target: "node",
  externals: [nodeExternals()],
  output: {
    //path: '/Users/cranpun/Desktop/work/001_netdrive/osmical/',
    filename: 'myco.js',

  },
  //devtool: 'inline-source-map',
  //devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
};
