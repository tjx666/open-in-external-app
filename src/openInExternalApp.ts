import { extname } from 'path';
import vscode, { Uri } from 'vscode';
import { wslToWindowsSync } from 'wsl-path';

import getExtensionConfig from './config';
import { open, isAsciiString } from './utils';

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
    const fsPath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!fsPath) return;
    const filePath =
        vscode.env.remoteName === 'wsl'
            ? wslToWindowsSync(fsPath, {
                  wslCommand: 'wsl.exe',
              })
            : fsPath;

    const ext = extname(filePath);
    const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);

    // when there is configuration map to it's extension, use use [open](https://github.com/sindresorhus/open)
    // except for configured appConfig.isElectronApp option
    let matchedConfigItem: ExtensionConfigItem | undefined;
    if (extensionName) matchedConfigItem = getMatchedConfigItem(extensionName);
    if (matchedConfigItem) {
        const candidateApps = matchedConfigItem.apps;
        if (typeof candidateApps === 'string') {
            open(filePath, candidateApps);
            return;
        }

        if (Array.isArray(candidateApps) && candidateApps.length >= 1) {
            if (candidateApps.length === 1) {
                open(filePath, candidateApps[0]);
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
                vscode.window.showErrorMessage(
                    `You can't set two application using the same title, please correct your configuration first!`,
                );
                return;
            }

            const pickerItems = candidateApps.map((app) => app.title);
            if (isMultiple) {
                const selectedTitles = await vscode.window.showQuickPick(pickerItems, {
                    canPickMany: true,
                    placeHolder: 'select the applications to open the file...',
                });
                if (selectedTitles) {
                    selectedTitles.forEach((title) => {
                        open(filePath, candidateApps.find((app) => app.title === title)!);
                    });
                }
            } else {
                const selectedTitle = await vscode.window.showQuickPick(pickerItems, {
                    placeHolder: 'select the application to open the file...',
                });

                if (selectedTitle) {
                    open(filePath, candidateApps.find((app) => app.title === selectedTitle)!);
                }
            }
            return;
        }
    }

    // default strategy
    // use vscode builtin API when filePath combines with ascii characters
    if (isAsciiString(filePath) && vscode.env.remoteName !== 'wsl') {
        // @ts-expect-error
        vscode.env.openExternal(Uri.file(filePath).toString());
    }
    // otherwise use [open](https://github.com/sindresorhus/open) which support arguments
    else {
        open(filePath);
    }
}
