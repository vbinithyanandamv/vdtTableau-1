const path = require('path');
module.exports = {
  entry: "./src/js/index.ts",
  output: {
    libraryTarget: 'window',
    library: 'VDTTBX',
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
      },
    ]
  }
};