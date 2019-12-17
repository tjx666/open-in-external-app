import * as vscode from 'vscode';
import { openFile } from '../util';

type Uri = vscode.Uri;

const handler = async (uri: Uri | undefined) => {
    openFile(uri, true);
};

const command: CommandModule = {
    identifier: 'openMultiple',
    handler,
};

export default command;
