const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractTextPlugin = new ExtractTextPlugin({
    filename: 'index-[hash].css',
    disable: process.env.NODE_ENV === 'development'
});

module.exports = {
    devtool: 'none',
    entry: ['./src/index.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'index-[hash].js'
    },
    devServer: {
        contentBase: './dist',
        port: 3002,
        host: 'localhost',
        historyApiFallback: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        'presets': [
                            'env',
                            'react',
                            'stage-0'
                        ],
                        'plugins': [
                            ['import', { libraryName: 'antd', style: true }]
                        ]

                    }

                }


            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader',
                        options: {
                            'modifyVars': { '@primary-color': '@blue-6' }
                        }
                    }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png)|(jpg)|(gif)$/,
                use: {
                    loader: 'url-loader?limit=20000&name=images/[name]-[hash:8].[ext]'
                }

            },
            {
                test: /\.(woff)|.(woff2)|.(svg)|.(eot)|.(ttf)$/,
                use: {
                    loader: 'url-loader?limit=10000&name=font/[name].[ext]'
                }
            }
        ]
    },
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.BannerPlugin('This file is created by czl,版权所有，翻版必究'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
    
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname + '/src', 'index.html'),
            filename: 'index.html',
            inject: 'body',
            title: 'Fek-Repository-学的不仅是技术，更是梦想！',
            favicon: './favicon.ico'

        }),
        extractTextPlugin

    ] :
        [
            new webpack.BannerPlugin('This file is created by czl,版权所有，翻版必究'),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
        
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname + '/src', 'index.html'),
                filename: 'index.html',
                inject: 'body',
                title: 'Fek-Repository-学的不仅是技术，更是梦想！',
                favicon: './favicon.ico'
            }),
            extractTextPlugin
        ]

};