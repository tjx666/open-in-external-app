import { resolve } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import FriendlyErrorsPlugin from '@soda/friendly-errors-webpack-plugin';

const projectRoot = resolve(__dirname, '../../');
const commonWebpackConfig: Configuration = {
    target: 'node',
    entry: resolve(projectRoot, 'src/extension.ts'),
    output: {
        libraryTarget: 'commonjs2',
        path: resolve(projectRoot, 'out'),
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
                    configFile: resolve(projectRoot, 'tsconfig.json'),
                },
            },
        ],
    },
    plugins: [
        new WebpackBar({
            name: 'VSCode extension',
            color: '#0066B8',
        }),
        new FriendlyErrorsPlugin(),
        new CleanWebpackPlugin(),
    ],
};

export default commonWebpackConfig;
