import vscode from 'vscode';
import openInExternalApp from '../openInExternalApp';

type Uri = vscode.Uri;

async function handler(uri: Uri | undefined): Promise<void> {
    openInExternalApp(uri, true);
}

const command: CommandModule = {
    identifier: 'openMultiple',
    handler,
};

export default command;
