import assert from 'assert';
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
                    apps: {
                        title: 'Typora',
                        isElectronApp: true,
                    },
                },
            ];
            assert.strictEqual(validateConfiguration(configuration).error, null);
        });
    });
});
