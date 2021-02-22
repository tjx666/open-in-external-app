import vscode from 'vscode';
import openInExternalApp from '../openInExternalApp';

type Uri = vscode.Uri;

async function handler(uri: Uri | undefined): Promise<void> {
    openInExternalApp(uri);
}

const command: CommandModule = {
    identifier: 'open',
    handler,
};

export default command;
