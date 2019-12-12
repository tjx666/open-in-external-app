import { extname } from 'path';
import * as vscode from 'vscode';
import open from 'open';
import { isRepeat } from '../util';
import getExtensionConfig from '../config';

type Uri = vscode.Uri;

const handler = async (uri: Uri) => {
    const filePath = uri.fsPath;
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

                    const selectedTitles = await vscode.window.showQuickPick(
                        candidateApps.map(app => app.title),
                        { canPickMany: true, placeHolder: 'select the applications to open the file...' }
                    );
                    if (selectedTitles) {
                        selectedTitles.forEach(title => {
                            const { openCommand } = candidateApps.find(app => app.title === title)!;
                            open(filePath, { app: openCommand });
                        });
                    }
                    return;
                }
            }
        }
    }

    vscode.env.openExternal(vscode.Uri.file(filePath));
};

const command: CommandModule = {
    identifier: 'open',
    handler,
};

export default command;
