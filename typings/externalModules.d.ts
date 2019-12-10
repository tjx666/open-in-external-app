declare module 'progress-bar-webpack-plugin' {
    import { Compiler } from 'webpack';

    interface ProgressBarPluginOptions {
        format: string;
        clear: boolean;
    }

    class ProgressBarPlugin {
        constructor(options?: Partial<ProgressBarPluginOptions>);
        apply(compiler: Compiler): void;
    }

    export = ProgressBarPlugin;
}
