import { extname } from 'path';
import vscode, { Uri } from 'vscode';
import _open from 'open';

import getExtensionConfig from './config';
import { isRepeat, isAsciiString } from './utils';

// FIXME: support none-ascii character path
function open(filePath: string, appConfig: ExternalAppConfig) {
    if (appConfig.isElectronApp) {
        vscode.env.openExternal(Uri.file(filePath));
    } else if (appConfig.openCommand) {
        _open(filePath, { app: [appConfig.openCommand, ...(appConfig.args ?? [])] });
    }
}

export default async function openInExternalApp(uri: Uri | undefined, isMultiple = false) {
    const filePath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!filePath) return;

    const ext = extname(filePath);
    const extensionName = ext === '' || ext === '.' ? null : ext.slice(1);

    if (extensionName) {
        const configuration: ExtensionConfigItem[] | null = getExtensionConfig();

        if (configuration) {
            const configItem = configuration.find((item) => item.extensionName === extensionName);

            if (configItem) {
                const candidateApps = configItem.apps;
                if (typeof candidateApps === 'string') {
                    _open(filePath, { app: candidateApps });
                    return;
                }

                if (Array.isArray(candidateApps) && candidateApps.length >= 1) {
                    if (candidateApps.length === 1) {
                        open(filePath, candidateApps[0]);
                        return;
                    }

                    if (isRepeat(candidateApps, (a, b) => a.title === b.title)) {
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

    if (isAsciiString(filePath)) {
        vscode.env.openExternal(Uri.file(filePath));
    } else {
        _open(filePath);
    }
}
