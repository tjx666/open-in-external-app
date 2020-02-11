import webpack from 'webpack';

import devWebpackConfig from './configs/webpack.dev';
import prodWebpackConfig from './configs/webpack.prod';

const isProd = process.env.NODE_ENV !== 'development';
const compiler = webpack(isProd ? prodWebpackConfig : devWebpackConfig);

compiler.run((error, stats) => {
    const compileError: Error & { details?: string } = error;

    if (error) {
        console.error(error);
        compileError.details && console.error(compileError.details);
        return;
    }

    const devStatsOpts = {
        preset: 'minimal',
        colors: true,
    };

    const prodStatsOpts = {
        preset: 'normal',
        colors: true,
    };

    console.log(stats.toString(isProd ? prodStatsOpts : devStatsOpts));
});
