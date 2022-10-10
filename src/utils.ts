import { constants as FS_CONSTANTS } from 'fs';
import fs from 'fs/promises';
import _open from 'open';
import vscode, { Uri } from 'vscode';

// FIXME: support none-ascii character path
export function open(filePath: string, appConfig?: string | ExternalAppConfig): void {
    if (typeof appConfig === 'string') {
        _open(filePath, {
            app: {
                name: appConfig,
            },
        });
    } else if (appConfig !== null && typeof appConfig === 'object') {
        if (appConfig.isElectronApp) {
            vscode.env.openExternal(Uri.file(filePath));
        } else if (appConfig.openCommand) {
            _open(filePath, {
                app: {
                    name: appConfig.openCommand,
                    arguments: appConfig.args ?? [],
                },
            });
        }
    } else {
        _open(filePath);
    }
}

export function isAsciiString(str: string): boolean {
    return [...str].every((char) => char.codePointAt(0)! <= 255);
}

export function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

export async function getSelectedResources() {
    const originalClipboard = await vscode.env.clipboard.readText();

    await vscode.commands.executeCommand('copyFilePath');
    const activeFilePath = await vscode.env.clipboard.readText();

    await vscode.env.clipboard.writeText(originalClipboard);

    return (await pathExists(activeFilePath)) ? Uri.file(activeFilePath) : undefined;
}
