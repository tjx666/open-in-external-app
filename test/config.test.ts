import assert from 'node:assert';

import { validateConfiguration } from '../src/config';

describe('#config', () => {
    describe('#validateConfiguration', () => {
        it(`should error as config can't object`, () => {
            assert.notStrictEqual(validateConfiguration({} as any).error, null);
        });

        it(`should error as apps field can't be ignored`, () => {
            const configuration: any = [{ extensionName: 'html' }];
            assert.notStrictEqual(validateConfiguration(configuration).error, null);
        });

        it(`should error as env variable have to be a string`, () => {
            const configuration: any = [
                {
                    extensionName: 'dat',
                    apps: [
                        {
                            title: 'invalid env block',
                            shellCommand: 'abc',
                            shellEnv: {
                                badvar: 404,
                            },
                        },
                    ],
                },
            ];
            assert.notStrictEqual(validateConfiguration(configuration).error, null);
        });

        it(`should error as 'msdos' is unsupported platform`, () => {
            const configuration: any = [
                {
                    extensionName: 'dat',
                    apps: [
                        {
                            title: 'invalid env block',
                            shellCommand: 'abc',
                            shellEnv: {
                                msdos: {
                                    dosvar: 'never',
                                },
                            },
                        },
                    ],
                },
            ];
            assert.notStrictEqual(validateConfiguration(configuration).error, null);
        });

        it(`should pass validation`, () => {
            const configuration: any = [
                {
                    extensionName: 'html',
                    apps: [
                        {
                            title: 'ff',
                            openCommand: '/a/b/firefox.exe',
                        },
                        {
                            title: 'chrome',
                            openCommand: '/a/b/chrome.exe',
                        },
                    ],
                },
                {
                    extensionName: 'tsx',
                    apps: 'code',
                },
                {
                    extensionName: 'md',
                    apps: [
                        {
                            title: 'Typora',
                            isElectronApp: true,
                        },
                    ],
                },
                {
                    extensionName: 'dat',
                    apps: [
                        {
                            title: 'single env block',
                            shellCommand: 'abc',
                            shellEnv: {
                                var1: "123",
                                var2: "xyz",
                            },
                        },
                        {
                            title: 'multiplatform env block',
                            shellCommand: 'abc',
                            shellEnv: {
                                windows: {
                                    winvar: 'Windows Platform',
                                },
                                osx: {
                                    macvar: 'macOS Platform',
                                },
                                linux: {
                                    linvar: 'Linux Platform',
                                },
                            },
                        },
                    ],
                },
            ];
            assert.notStrictEqual(validateConfiguration(configuration).error, null);
        });
    });
});
