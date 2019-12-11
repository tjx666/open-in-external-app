interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}

interface ExternalApplication {
    title: string;
    cmd: string;
}

interface ExtensionConfiguration {
    [fileType: string]: ExternalApplication[] | string;
}
