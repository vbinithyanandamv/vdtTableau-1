// const path = require('path');
// module.exports = {
//   entry: "./src/js/index.ts",
//   output: {
//     libraryTarget: 'umd',
//     library: 'VDTTBX',
//     path: path.resolve(__dirname, "dist/js"),
//     filename: "bundle.js"
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         loader: 'babel-loader',
//       },
//     ]
//   }
// };



const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const libraryName = "VDTTBX";

/**
 * Load the config based on the target ( dev | prod)
 * @param {Object} env - Environment variable
 */
const modeConfig = env => require(`./webpack/webpack.${env.mode}`)(env);

// Common webpack configuration
const common = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts||.tsx$/,
                use: 'babel-loader',
                exclude: [
                    /node_modules/,
                    /test/
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./"
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: 'base64-inline-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new webpack.ProgressPlugin()        
    ],
    externals: {
    },
    output: {
        library: libraryName,
        libraryTarget: 'umd',
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
};

module.exports = (mode = "production") => {
    return webpackMerge(common, modeConfig(mode));
};
