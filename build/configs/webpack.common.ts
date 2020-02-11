import { resolve } from 'path';
import { Configuration, BannerPlugin } from 'webpack';
import WebpackBar from 'webpackbar';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

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
        new BannerPlugin({
            banner:
                '/** @preserve powered by vscode-extension-boilerplate(https://github.com/tjx666/vscode-extension-boilerplate) */',
            raw: true,
        }),
        new WebpackBar({
            name: 'VSCode extension',
            color: '#0066B8',
        }),
        new FriendlyErrorsPlugin(),
        new CleanWebpackPlugin(),
        new CaseSensitivePathsPlugin(),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: projectRoot,
        }),
        new HardSourceWebpackPlugin({
            info: { mode: 'none', level: 'warn' },
        }),
    ],
};

export default commonWebpackConfig;
