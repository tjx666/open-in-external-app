import { resolve } from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

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
        new ProgressBarPlugin(),
        new CleanWebpackPlugin(),
        new HardSourceWebpackPlugin({
            info: { mode: 'none', level: 'warn' },
        }),
    ],
};

export default commonWebpackConfig;
