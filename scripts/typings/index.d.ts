declare module 'speed-measure-webpack-plugin' {
    import { Configuration, Plugin } from 'webpack';

    interface SpeedMeasurePluginOptions {
        disable: boolean;
        outputFormat: 'json' | 'human' | 'humanVerbose' | ((outputObj: object) => void);
        outputTarget: string | ((outputObj: string) => void);
        pluginNames: object;
        granularLoaderData: boolean;
    }

    class SpeedMeasurePlugin extends Plugin {
        constructor(options?: Partial<SpeedMeasurePluginOptions>);
        wrap(webpackConfig: Configuration): Configuration;
    }

    export = SpeedMeasurePlugin;
}

declare module '@nuxt/friendly-errors-webpack-plugin' {
    import { Plugin, Compiler } from 'webpack';

    declare class FriendlyErrorsWebpackPlugin extends Plugin {
        constructor(options?: FriendlyErrorsWebpackPlugin.Options);

        apply(compiler: Compiler): void;
    }

    declare namespace FriendlyErrorsWebpackPlugin {
        enum Severity {
            Error = 'error',
            Warning = 'warning',
        }

        interface Options {
            compilationSuccessInfo?: {
                messages: string[];
                notes: string[];
            };
            onErrors?(severity: Severity, errors: string): void;
            clearConsole?: boolean;
            additionalFormatters?: Array<(errors: WebpackError[], type: Severity) => string[]>;
            additionalTransformers?: Array<(error: any) => any>;
        }

        interface WebpackError {
            message: string;
            file: string;
            origin: string;
            name: string;
            severity: Severity;
            webpackError: any;
        }
    }

    export = FriendlyErrorsWebpackPlugin;
}
