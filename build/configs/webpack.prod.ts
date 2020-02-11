import { argv } from 'yargs';
import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import SizePlugin from 'size-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import commonWebpackConfig from './webpack.common';

const mergedConfiguration: Configuration = merge(commonWebpackConfig, {
    mode: 'production',
    plugins: [new SizePlugin({ writeFile: false })],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                extractComments: false,
            }),
        ],
    },
});

if (argv.analyze) mergedConfiguration.plugins!.push(new BundleAnalyzerPlugin());

const smp = new SpeedMeasurePlugin();
const prodWebpackConfiguration = smp.wrap(mergedConfiguration);

export default prodWebpackConfiguration;
