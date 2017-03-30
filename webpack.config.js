const webpack = require('webpack');
var path = require('path');
var env = process.env.NODE_ENV;

module.exports = {
	entry: ['webpack/hot/dev-server', path.resolve(__dirname, './src/main.js')],
    output: {
	    path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
	},
    devServer: {
        inline: true,
        port: 3000,
        host: '0.0.0.0'
    },
	module: {
        loaders: [ 
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            } 
        },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style!css!less' },
        {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        },
        { test: /\.(jpg|png)$/, loader: "url" }
        ]
   },
   plugins: [
            // new webpack.optimize.CommonsChunkPlugin( chunkName= "vendor", /* filename= */"./build/vendor.dll.js"),
            new webpack.DllReferencePlugin({
                context: __dirname,//context 需要跟dll中的保持一致，这个用来指导 Webpack 匹配 manifest 中库的路径；
                manifest: require('./build/manifest.json')
            }),
            new webpack.DefinePlugin({
                // 'process.env': {NODE_ENV: ''production''}
                'process.env': {
                    NODE_ENV: JSON.stringify('dev')
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ]
};
