import { extname } from 'path';
import * as vscode from 'vscode';
import open from 'open';

type Uri = vscode.Uri;

const handler = async (uri: Uri) => {
    const filePath = uri.fsPath;
    const ext = extname(filePath);
    const fileType = ext === '' || ext === '.' ? 'default' : ext.slice(1);
    const configuration: ExtensionConfiguration | undefined = vscode.workspace
        .getConfiguration()
        .get('openInExternalApp.openMapper');

    if (configuration && configuration[fileType]) {
        const candidateApps: ExternalApplication[] | string = configuration[fileType];
        let openCommand: string | undefined;

        if (typeof candidateApps === 'string') {
            openCommand = candidateApps;
        } else if (Array.isArray(candidateApps)) {
            const pickerItems = candidateApps.map(app => ({
                label: app.title,
                detail: app.cmd,
            }));
            const selectedItem = await vscode.window.showQuickPick(pickerItems);
            if (selectedItem) openCommand = selectedItem.detail;
        }

        if (openCommand) {
            open(filePath, { app: openCommand, url: true });
        }
    }

    vscode.env.openExternal(vscode.Uri.file(filePath));
};

const command: CommandModule = {
    identifier: 'open',
    handler,
};

export default command;
