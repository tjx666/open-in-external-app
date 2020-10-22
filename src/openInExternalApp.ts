import { extname } from 'path';
import vscode, { Uri } from 'vscode';

import getExtensionConfig from './config';
import { open, isAsciiString } from './utils';

export default async function openInExternalApp(uri: Uri | undefined, isMultiple = false) {
    const filePath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) return;

    const ext = extname(filePath);
    const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);

    // when there is configuration map to it's extension, use use [open](https://github.com/sindresorhus/open)
    // except for configured appConfig.isElectronApp option
    if (extensionName) {
        const configuration: ExtensionConfigItem[] | null = getExtensionConfig();
        if (configuration) {
            const configItem = configuration.find((item) => {
                return Array.isArray(item.extensionName)
                    ? item.extensionName.some((name) => name === extensionName)
                    : item.extensionName === extensionName;
            });
            if (configItem) {
                const candidateApps = configItem.apps;
                if (typeof candidateApps === 'string') {
                    open(filePath, candidateApps);
                    return;
                }

                if (Array.isArray(candidateApps) && candidateApps.length >= 1) {
                    if (candidateApps.length === 1) {
                        open(filePath, candidateApps[0]);
                        return;
                    }

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
        }
    }

    // use vscode builtin API when filePath combines with ascii characters
    if (isAsciiString(filePath)) {
        vscode.env.openExternal(Uri.file(filePath));
    }
    // otherwise use [open](https://github.com/sindresorhus/open) which support arguments
    else {
        open(filePath);
    }
}
