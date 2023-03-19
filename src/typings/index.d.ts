declare module 'wsl-path';

interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}

interface ExternalAppConfig {
    title: string;
    openCommand?: string;
    args?: string[];
    isElectronApp?: boolean;
    shellCommand?: string;
}

interface ExtensionConfigItem {
    id: string;
    extensionName: string | string[];
    apps: ExternalAppConfig[] | string;
}
