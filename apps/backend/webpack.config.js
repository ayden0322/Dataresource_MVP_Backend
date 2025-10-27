const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['shared'], // 允許打包 shared package
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules(?!\/shared)/,  // 不排除 shared package
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
