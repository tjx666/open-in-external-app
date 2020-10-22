import webpack from 'webpack';

import devWebpackConfig from './configs/webpack.dev';
import prodWebpackConfig from './configs/webpack.prod';

const isProd = process.env.NODE_ENV !== 'development';
const compiler = webpack(isProd ? prodWebpackConfig : devWebpackConfig);

compiler.run((error, stats) => {
    if (error) {
        console.error(error);
        return;
    }

    const prodStats = {
        preset: 'normal',
        colors: true,
    };

    console.log(stats?.toString(isProd ? prodStats : 'minimal'));
});

compiler.close((err) => {
    if (err) {
        console.error(err);
    }
});
