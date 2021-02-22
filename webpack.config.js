const currentTask = process.env.npm_lifecycle_event
// const currentTask = 'dev';
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizePlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
]


//FOR IMAGES
class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function () {
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}

// CSS FOR WEBPACK
let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader?url=false', 
    {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: postCSSPlugins
            }
        }
    }]
}

// CONFIG FOR DEV AND PROD
let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template:  `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    }
};

// DEV
if (currentTask === 'dev') {
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    }

    config.devServer = {
        before: function(app, server) {
            server._watch('./app/**/*.html')
        },
        contentBase: path.join(__dirname, 'app'),
        hot : true,
        port: 3000,
        host: '0.0.0.0'
    }

    config.mode = 'development'
}


// PROD
if (currentTask === 'build') {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/, 
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    })
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: '[name].[chunckhash].js',
        chunkFilename : '[name].[chunckhash].js',
        path: path.resolve(__dirname, 'docs')
    }

    config.mode = 'production'

    config.optimization = {
        splitChunks: {chunks: 'all'},
        minimize: true,
        minimizer: [`...`, new CssMinimizePlugin()]
    }

    config.plugins.push(new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({filename: 'style.[chunkhash].css'}),
    new RunAfterCompile()
    )
}



module.exports = config;