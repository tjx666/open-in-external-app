import type { ExecOptions } from 'node:child_process';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';

import type { Options as OpenOptions } from 'open';
import _open from 'open';
import vscode, { Uri } from 'vscode';

import { logger } from './logger';
import { getShellEnv, mergeEnvironments, isWindows, isMacintosh, isLinux } from './platform';
import { parseVariables } from './variable';

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export const exec = promisify(_exec);

function openByPkg(filePath: string, options?: OpenOptions) {
    logger.info(`open file by open pkg, options:\n${JSON.stringify(options, undefined, 4)}`);
    return _open(filePath, options);
}

async function openByBuiltinApi(filePath: string) {
    logger.info('open file by vscode builtin api');
    // https://github.com/microsoft/vscode/issues/88273
    return vscode.env.openExternal(Uri.file(filePath));
}

export async function open(filePath: string, appConfig?: string | ExternalAppConfig) {
    logger.info(`opened file is: "${filePath}"`);

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
            const parsedCommand = (
                await parseVariables([appConfig.shellCommand!], Uri.file(filePath))
            )[0];
            logger.info(`open file by shell command: "${parsedCommand}"`);
            try {
                if (appConfig.shellEnv) {
                    const shellEnv = getShellEnv();

                    let additionalEnv: NodeJS.ProcessEnv
                    if (isWindows && typeof appConfig.shellEnv.windows === 'object') {
                        additionalEnv = appConfig.shellEnv.windows;
                    } else if (isMacintosh && typeof appConfig.shellEnv.osx === 'object') {
                        additionalEnv = appConfig.shellEnv.osx;
                    } else if (isLinux && typeof appConfig.shellEnv.linux === 'object') {
                        additionalEnv = appConfig.shellEnv.linux;
                    } else {
                        additionalEnv = appConfig.shellEnv as NodeJS.ProcessEnv;
                    }

                    await mergeEnvironments(shellEnv, additionalEnv, Uri.file(filePath))
                    const options: ExecOptions = { env: shellEnv };
                    await exec(parsedCommand, options);
                } else {
                    await exec(parsedCommand);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `open file by shell command failed, execute: "${parsedCommand}"`,
                );
                logger.info(error);
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
