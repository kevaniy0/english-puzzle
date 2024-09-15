import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';

type Mode = 'development' | 'production';

interface EnvVariables {
    mode: Mode;
    port: number;
}

export default (env: EnvVariables) => {
    const devMode = env.mode === 'development';
    const config: webpack.Configuration = {
        mode: devMode ? 'development' : 'production',
        devtool: devMode ? 'eval-cheap-module-source-map' : false,
        entry: [path.resolve(__dirname, 'src', 'index.ts')],
        devServer: {
            static: path.resolve(__dirname, './dist'),
            port: env.port ?? 3000,
            hot: true,
            open: true,
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            filename: 'bundle.js',
            assetModuleFilename: 'assets/[name][ext]',
        },

        module: {
            rules: [
                {
                    test: /\.(c|sa|sc)ss$/i,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [['postcss-preset-env']],
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name][ext]',
                    },
                },
                {
                    test: /\.(jpe?g|png|svg|gif|wepb)$/i,
                    use: [
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                optipng: {
                                    enabled: false,
                                },
                                pngquant: {
                                    quality: [0.65, 0.9],
                                    speed: 4,
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                webp: {
                                    quality: 75,
                                },
                            },
                        },
                    ],
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/img/[name][ext]',
                    },
                },
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src', 'index.html'),
                filename: 'index.html',
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css',
            }),
            new CopyPlugin({
                patterns: [
                    { from: 'src/assets/img', to: 'assets/img' },
                    { from: 'src/assets/fonts', to: 'assets/fonts' }, // example
                    { from: 'src/data', to: 'data' },
                ],
            }),
        ],

        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
    };
    return config;
};
