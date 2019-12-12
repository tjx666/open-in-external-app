interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}

interface ExternalApplication {
    title: string;
    openCommand: string;
}

interface ExtensionConfigItem {
    extensionName: string;
    apps: ExternalApplication[] | string;
}
