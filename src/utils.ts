import { exec as _exec } from 'child_process';
import { constants as FS_CONSTANTS } from 'fs';
import fs from 'fs/promises';
import { promisify } from 'util';
import _open, { Options as OpenOptions } from 'open';
import vscode, { Uri } from 'vscode';

import { logger } from './logger';
import parseVariables from './parseVariables';

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export const exec = promisify(_exec);

function openByPkg(filePath: string, options?: OpenOptions) {
    logger.log('Open file by open pkg, options:\n' + JSON.stringify(options, null, 4));
    return _open(filePath, options);
}

async function openByBuiltinApi(filePath: string) {
    logger.log('Open file by vscode builtin api');
    // https://github.com/microsoft/vscode/issues/85930#issuecomment-821882174
    // @ts-ignore
    return vscode.env.openExternal(Uri.file(filePath).toString());
}

export async function open(filePath: string, appConfig?: string | ExternalAppConfig) {
    logger.log(`Opened file is: "${filePath}"`);

    if (typeof appConfig === 'string') {
        await openByPkg(filePath, {
            app: {
                name: appConfig,
            },
        });
    } else if (appConfig !== null && typeof appConfig === 'object') {
        if (appConfig.isElectronApp) {
            await openByBuiltinApi(filePath);
        } else if (appConfig.shellCommand) {
            const parsedCommand = (await parseVariables([appConfig.shellCommand!], Uri.file(filePath)))[0];
            logger.log(`Open file by shell command: "${parsedCommand}"`);
            try {
                await exec(parsedCommand);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Open file by shell command failed, execute: "${parsedCommand}"`);
                logger.log(error);
            }
        } else if (appConfig.openCommand) {
            const args = await parseVariables(appConfig.args ?? [], Uri.file(filePath));
            await openByPkg(filePath, {
                app: {
                    name: appConfig.openCommand,
                    arguments: args,
                },
            });
        }
    } else if (vscode.env.remoteName === 'wsl') {
        await openByPkg(filePath);
    } else {
        await openByBuiltinApi(filePath);
    }
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
