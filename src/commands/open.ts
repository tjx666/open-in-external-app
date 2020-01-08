import * as vscode from 'vscode';
import openFile from '../openFile';

type Uri = vscode.Uri;

async function handler(uri: Uri | undefined) {
    openFile(uri);
}

const command: CommandModule = {
    identifier: 'open',
    handler,
};

export default command;
