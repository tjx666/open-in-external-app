import vscode, { Uri } from 'vscode';

import { pathExists } from './fs';

export async function getActiveFileUri() {
    const originalClipboard = await vscode.env.clipboard.readText();

    let activeFilePath: string;
    try {
        await vscode.commands.executeCommand('copyFilePath');
        activeFilePath = await vscode.env.clipboard.readText();
    } finally {
        await vscode.env.clipboard.writeText(originalClipboard);
    }

    return (await pathExists(activeFilePath)) ? Uri.file(activeFilePath) : undefined;
}
