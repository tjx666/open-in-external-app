import { extname } from 'path';
import vscode, { Uri } from 'vscode';
import { localize } from 'vscode-nls-i18n';
import { windowsToWsl } from 'wsl-path';

import getExtensionConfig from './config';
import { logger } from './logger';
import { getActiveFile, open } from './utils';

function getMatchedConfigItem(
    configuration: ExtensionConfigItem[],
    extensionName?: string,
    configItemId?: string,
): ExtensionConfigItem | undefined {
    let matchedConfigItem: ExtensionConfigItem | undefined;

    if (extensionName === undefined) {
        logger.log('find config by configItemId');
        matchedConfigItem = configuration.find((item) => item.id === configItemId);
    } else {
        logger.log('find config by extensionName');
        matchedConfigItem = configuration.find((item) =>
            Array.isArray(item.extensionName)
                ? item.extensionName.some((name) => name === extensionName)
                : item.extensionName === extensionName,
        );
    }

    if (!matchedConfigItem) {
        const fallbackConfigItem = configuration?.find((item) => item.extensionName === '*');
        if (fallbackConfigItem) {
            matchedConfigItem = fallbackConfigItem;
        }
    }

    return matchedConfigItem;
}

function getSharedConfigItem(configuration: ExtensionConfigItem[]): ExtensionConfigItem | undefined {
    return configuration.find((item) => item.extensionName === '__ALL__');
}

async function openWithConfigItem(filePath: string, matchedConfigItem: ExtensionConfigItem, isMultiple: boolean) {
    logger.log('open with configItem:\n' + JSON.stringify(matchedConfigItem, undefined, 4));

    const candidateApps = matchedConfigItem.apps;
    if (typeof candidateApps === 'string') {
        await open(filePath, candidateApps);
        return;
    }

    if (Array.isArray(candidateApps) && candidateApps.length >= 1) {
        if (candidateApps.length === 1) {
            await open(filePath, candidateApps[0]);
            return;
        }

        // check repeat in candidateApps
        let isRepeat = false;
        const traversedTitles = new Set();
        for (let i = 0, len = candidateApps.length; i < len; i++) {
            const { title } = candidateApps[i];
            if (traversedTitles.has(title)) {
                isRepeat = true;
                break;
            }
            traversedTitles.add(title);
        }
        if (isRepeat) {
            vscode.window.showErrorMessage(localize('msg.error.sameTitleMultipleApp'));
            return;
        }

        const pickerItems = candidateApps.map((app) => app.title);
        if (isMultiple) {
            const selectedTitles = await vscode.window.showQuickPick(pickerItems, {
                canPickMany: true,
                placeHolder: localize('msg.quickPick.selectApps.placeholder'),
            });
            if (selectedTitles) {
                selectedTitles.forEach(async (title) => {
                    await open(filePath, candidateApps.find((app) => app.title === title)!);
                });
            }
        } else {
            const selectedTitle = await vscode.window.showQuickPick(pickerItems, {
                placeHolder: localize('msg.quickPick.selectApp.placeholder'),
            });

            if (selectedTitle) {
                await open(filePath, candidateApps.find((app) => app.title === selectedTitle)!);
            }
        }
    }
}

export default async function openInExternalApp(
    uri: Uri | undefined,
    configItemId?: string,
    isMultiple = false,
): Promise<void> {
    // if run command with command plate, uri is undefined, fallback to activeTextEditor
    uri ??= vscode.window.activeTextEditor?.document.uri ?? (await getActiveFile());
    if (!uri) return;

    const { fsPath } = uri;
    const filePath =
        vscode.env.remoteName === 'wsl'
            ? await windowsToWsl(fsPath, {
                  wslCommand: 'wsl.exe',
              })
            : fsPath;

    // when there is configuration map to it's extension, use use [open](https://github.com/sindresorhus/open)
    // except for configured appConfig.isElectronApp option
    let matchedConfigItem: ExtensionConfigItem | undefined;
    const configuration = getExtensionConfig();
    if (configItemId === undefined) {
        const ext = extname(filePath);
        const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);
        logger.log(`parsed extension name: ${extensionName}`);
        if (extensionName) matchedConfigItem = getMatchedConfigItem(configuration, extensionName);
    } else {
        matchedConfigItem = getMatchedConfigItem(configuration, undefined, configItemId);
    }
    if (matchedConfigItem) {
        logger.log('found matched config');
        await openWithConfigItem(filePath, matchedConfigItem, isMultiple);
    } else {
        await open(filePath);
    }

    const sharedConfigItem = getSharedConfigItem(configuration);
    if (sharedConfigItem) {
        logger.log('found shared config');
        await openWithConfigItem(filePath, sharedConfigItem, false);
    }
}
