interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}

interface ExternalAppConfig {
    title: string;
    openCommand?: string;
    args?: string[];
    isElectronApp?: boolean;
}

interface ExtensionConfigItem {
    extensionName: string;
    apps: ExternalAppConfig[] | string;
}
