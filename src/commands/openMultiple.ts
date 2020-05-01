import * as vscode from 'vscode';
import openInExternalApp from '../openInExternalApp';

type Uri = vscode.Uri;

async function handler(uri: Uri | undefined) {
    openInExternalApp(uri, true);
}

const command: CommandModule = {
    identifier: 'openMultiple',
    handler,
};

export default command;
