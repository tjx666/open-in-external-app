import { extname } from 'path';
import * as vscode from 'vscode';
import open from 'open';
import { iSRepeat } from '../util';

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
            if (iSRepeat(candidateApps, (a, b) => a.title === b.title)) {
                vscode.window.showErrorMessage(
                    `You can't set two application use the same title, check you configuration!`
                );
            }

            const selectedTitle = await vscode.window.showQuickPick(candidateApps.map(app => app.title));
            if (selectedTitle) openCommand = candidateApps.find(app => app.title === selectedTitle)!.cmd;
        }

        if (openCommand) {
            open(filePath, { app: openCommand });
        }
    }

    vscode.env.openExternal(vscode.Uri.file(filePath));
};

const command: CommandModule = {
    identifier: 'open',
    handler,
};

export default command;
