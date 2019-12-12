import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import commonWebpackConfig from './webpack.common';

const mergedConfiguration: Configuration = merge(commonWebpackConfig, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
});

const smp = new SpeedMeasurePlugin();
const prodWebpackConfiguration = smp.wrap(mergedConfiguration);

export default prodWebpackConfiguration;
