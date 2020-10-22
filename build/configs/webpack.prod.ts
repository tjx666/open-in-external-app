import { argv } from 'yargs';
import { BannerPlugin, Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import commonWebpackConfig from './webpack.common';

const mergedConfiguration: Configuration = merge(commonWebpackConfig, {
    mode: 'production',
    plugins: [
        new BannerPlugin({
            banner:
                '/** @preserve powered by vscode-extension-boilerplate(https://github.com/tjx666/vscode-extension-boilerplate) */',
            raw: true,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
            }) as any,
        ],
    },
});

// eslint-disable-next-line import/no-mutable-exports
let prodWebpackConfiguration = mergedConfiguration;
if (argv.analyze) {
    mergedConfiguration.plugins!.push(new BundleAnalyzerPlugin());
    const smp = new SpeedMeasurePlugin();
    prodWebpackConfiguration = smp.wrap(mergedConfiguration);
}

export default prodWebpackConfiguration;
