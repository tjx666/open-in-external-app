interface CommandModule {
    identifier: string;
    handler: (...args: any[]) => any;
}
