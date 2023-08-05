import { extname } from 'node:path';

import type { Uri } from 'vscode';
import vscode from 'vscode';
import { localize } from 'vscode-nls-i18n';
import { windowsToWslSync } from 'wsl-path';

import getExtensionConfig from './config';
import { logger } from './utils/logger';
import { open } from './utils/open';
import { getActiveFileUri } from './utils/uri';

function getFallbackConfigItem(configuration: ExtensionConfigItem[]) {
    return configuration?.find((item) => item.extensionName === '*');
}

function getConfigItemByExtName(configuration: ExtensionConfigItem[], extensionName: string) {
    logger.info('find config by extensionName');
    const matchedConfigItem = configuration.find((item) =>
        Array.isArray(item.extensionName)
            ? item.extensionName.includes(extensionName)
            : item.extensionName === extensionName,
    );
    return matchedConfigItem ?? getFallbackConfigItem(configuration);
}

function getConfigItemById(configuration: ExtensionConfigItem[], configItemId: string) {
    logger.info('find config by configItemId');
    return (
        configuration.find((item) => item.id === configItemId) ??
        getFallbackConfigItem(configuration)
    );
}

function getSharedConfigItem(configuration: ExtensionConfigItem[]) {
    return configuration.find((item) => item.extensionName === '__ALL__');
}

async function openWithConfigItem(
    filePath: string,
    matchedConfigItem: ExtensionConfigItem,
    isMultiple: boolean,
) {
    logger.info(`open with configItem:\n${JSON.stringify(matchedConfigItem, undefined, 4)}`);

    const candidateApps = matchedConfigItem.apps;
    if (typeof candidateApps === 'string') {
        await open(filePath, candidateApps);
        return;
    }

    if (Array.isArray(candidateApps) && candidateApps.length > 0) {
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
    uri ??= vscode.window.activeTextEditor?.document.uri ?? (await getActiveFileUri());
    if (!uri) return;

    const { fsPath } = uri;
    const filePath =
        vscode.env.remoteName === 'wsl'
            ? windowsToWslSync(fsPath, {
                  wslCommand: 'wsl.exe',
              })
            : fsPath;

    // when there is configuration map to it's extension, use [open](https://github.com/sindresorhus/open)
    // except for configured appConfig.isElectronApp option
    let matchedConfigItem: ExtensionConfigItem | undefined;
    const configuration = getExtensionConfig();
    if (configItemId === undefined) {
        const ext = extname(filePath);
        const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);
        logger.info(`parsed extension name: ${extensionName}`);
        if (extensionName) {
            matchedConfigItem = getConfigItemByExtName(configuration, extensionName);
        }
    } else {
        matchedConfigItem = getConfigItemById(configuration, configItemId);
    }

    if (matchedConfigItem) {
        logger.info('found matched config');
        await openWithConfigItem(filePath, matchedConfigItem, isMultiple);
    } else {
        logger.info('no matched config');
        await open(filePath);
    }

    const sharedConfigItem = getSharedConfigItem(configuration);
    if (sharedConfigItem) {
        logger.info('found shared config');
        await openWithConfigItem(filePath, sharedConfigItem, false);
    }
}
