import { extname } from 'path';
import * as vscode from 'vscode';
import open from 'open';
import getExtensionConfig from './config';

const isRepeat = <T>(arr: T[], isEqual?: (a: T, b: T) => boolean): boolean => {
    const { length } = arr;
    if (length <= 1) return false;

    for (let i = 0; i <= length - 2; i++) {
        for (let j = i + 1; j <= length - 1; j++) {
            if (isEqual) {
                if (isEqual(arr[i], arr[j])) {
                    return true;
                }
            } else if (arr[i] === arr[j]) {
                return true;
            }
        }
    }

    return false;
};

const openFile = async (uri: vscode.Uri | undefined, isMultiple = false) => {
    const filePath = uri?.fsPath || vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) return;

    const ext = extname(filePath);
    const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);

    if (extensionName) {
        const configuration: ExtensionConfigItem[] | null = getExtensionConfig();

        if (configuration) {
            const configItem = configuration.find(item => item.extensionName === extensionName);

            if (configItem) {
                const candidateApps = configItem.apps;
                if (typeof candidateApps === 'string') {
                    open(filePath, { app: candidateApps });
                    return;
                }

                if (Array.isArray(candidateApps) && candidateApps.length >= 1) {
                    if (candidateApps.length === 1) {
                        open(filePath, { app: candidateApps[0].openCommand });
                        return;
                    }

                    if (isRepeat(candidateApps, (a, b) => a.title === b.title)) {
                        vscode.window.showErrorMessage(
                            `You can't set two application using the same title, please correct your configuration first!`
                        );
                        return;
                    }

                    const pickerItems = candidateApps.map(app => app.title);
                    if (isMultiple) {
                        const selectedTitles = await vscode.window.showQuickPick(pickerItems, {
                            canPickMany: true,
                            placeHolder: 'select the applications to open the file...',
                        });
                        if (selectedTitles) {
                            selectedTitles.forEach(title => {
                                const { openCommand } = candidateApps.find(app => app.title === title)!;
                                open(filePath, { app: openCommand });
                            });
                        }
                    } else {
                        const selectedTitle = await vscode.window.showQuickPick(pickerItems, {
                            placeHolder: 'select the application to open the file...',
                        });

                        if (selectedTitle) {
                            const { openCommand } = candidateApps.find(app => app.title === selectedTitle)!;
                            open(filePath, { app: openCommand });
                        }
                    }
                    return;
                }
            }
        }
    }

    vscode.env.openExternal(vscode.Uri.file(filePath));
};

export { isRepeat, openFile };
