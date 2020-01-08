import * as vscode from 'vscode';
import openFile from '../openFile';

type Uri = vscode.Uri;

async function handler(uri: Uri | undefined) {
    openFile(uri, true);
}

const command: CommandModule = {
    identifier: 'openMultiple',
    handler,
};

export default command;
