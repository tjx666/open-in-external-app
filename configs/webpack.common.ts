import { resolve } from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const commonWebpackConfig: Configuration = {
    target: 'node',
    entry: resolve(__dirname, '../src/extension.ts'),
    output: {
        libraryTarget: 'commonjs2',
        path: resolve(__dirname, '../out'),
        filename: 'extension.js',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    resolve: { extensions: ['.ts', '.js'] },
    externals: {
        vscode: 'commonjs vscode',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: resolve(__dirname, '../tsconfig.dev.json'),
                },
            },
        ],
    },
    plugins: [
        new ProgressBarPlugin(),
        new CleanWebpackPlugin(),
        new HardSourceWebpackPlugin({
            info: { mode: 'none', level: 'warn' },
        }),
    ],
};

export default commonWebpackConfig;
