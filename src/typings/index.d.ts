declare module 'wsl-path';

interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}

interface PlatformVariables {
    windows?: NodeJS.ProcessEnv;
    linux?: NodeJS.ProcessEnv;
    osx?: NodeJS.ProcessEnv;
}

interface ExternalAppConfig {
    title: string;
    openCommand?: string;
    args?: string[];
    isElectronApp?: boolean;
    shellCommand?: string;
    shellEnv?: NodeJS.ProcessEnv | PlatformVariables;
}

interface ExtensionConfigItem {
    id: string;
    extensionName: string | string[];
    apps: ExternalAppConfig[] | string;
}
