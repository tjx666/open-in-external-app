import { extname } from 'path';
import vscode, { Uri } from 'vscode';
import { localize } from 'vscode-nls-i18n';
import { windowsToWsl } from 'wsl-path';

import getExtensionConfig from './config';
import { logger } from './logger';
import { getActiveFile, open } from './utils';

function getMatchedConfigItem(extensionName: string): ExtensionConfigItem | undefined {
    const configuration: ExtensionConfigItem[] = getExtensionConfig();
    let matchedConfigItem = configuration.find((item) =>
        Array.isArray(item.extensionName)
            ? item.extensionName.some((name) => name === extensionName)
            : item.extensionName === extensionName,
    );

    if (!matchedConfigItem) {
        const allFilesOpenWithConfig = configuration?.find((item) => item.extensionName === '*');
        if (allFilesOpenWithConfig) {
            matchedConfigItem = allFilesOpenWithConfig;
        }
    }

    return matchedConfigItem;
}

export default async function openInExternalApp(uri: Uri | undefined, isMultiple = false): Promise<void> {
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

    const ext = extname(filePath);
    const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);
    logger.log(`parsed extension name: ${extensionName}`);

    // when there is configuration map to it's extension, use use [open](https://github.com/sindresorhus/open)
    // except for configured appConfig.isElectronApp option
    let matchedConfigItem: ExtensionConfigItem | undefined;
    if (extensionName) matchedConfigItem = getMatchedConfigItem(extensionName);
    if (matchedConfigItem) {
        logger.log('matchedConfigItem:\n' + JSON.stringify(matchedConfigItem, null, 4));
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
            return;
        }
    }

    await open(filePath);
}
