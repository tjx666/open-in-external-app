import { exec as _exec } from 'child_process';
import { constants as FS_CONSTANTS } from 'fs';
import fs from 'fs/promises';
import _open from 'open';
import { promisify } from 'util';
import vscode, { Uri } from 'vscode';

import parseVariables from './parseVariables';

export const exec = promisify(_exec);

// FIXME: support none-ascii character path
export async function open(filePath: string, appConfig?: string | ExternalAppConfig) {
    if (typeof appConfig === 'string') {
        await _open(filePath, {
            app: {
                name: appConfig,
            },
        });
    } else if (appConfig !== null && typeof appConfig === 'object') {
        if (appConfig.isElectronApp) {
            await vscode.env.openExternal(Uri.file(filePath));
        } else if (appConfig.shellCommand) {
            const parsedCommand = (await parseVariables([appConfig.shellCommand!], Uri.file(filePath)))[0];
            await exec(parsedCommand);
        } else if (appConfig.openCommand) {
            const args = await parseVariables(appConfig.args ?? [], Uri.file(filePath));
            await _open(filePath, {
                app: {
                    name: appConfig.openCommand,
                    arguments: args,
                },
            });
        }
    } else {
        await _open(filePath);
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

export async function getActiveFile() {
    const originalClipboard = await vscode.env.clipboard.readText();

    await vscode.commands.executeCommand('copyFilePath');
    const activeFilePath = await vscode.env.clipboard.readText();

    await vscode.env.clipboard.writeText(originalClipboard);

    return (await pathExists(activeFilePath)) ? Uri.file(activeFilePath) : undefined;
}
