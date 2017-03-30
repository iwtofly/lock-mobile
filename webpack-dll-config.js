const path = require('path');
const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
    'react-router'
];

module.exports={
    entry: {
        'vendor':vendors,
    },
    output:{
        path:path.join(__dirname, 'build'),
        filename:'[name].dll.js',//[name]的部分由entry的名字替换
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library:'[name]_library',
    },
    plugins:[
        new webpack.DllPlugin({
            /**
             * path 定义 manifest 文件生成的位置
             */
            path: './build/manifest.json',
            /**
             * name 是dll暴露的对象名，要跟 output.library 保持一致；
             * dll bundle 输出到那个全局变量上
             */
            name: '[name]_library',
            context:__dirname //是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
        })
    ]
}