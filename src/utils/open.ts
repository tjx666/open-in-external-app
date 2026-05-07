import type { ExecOptions } from 'node:child_process';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';

import type { Options as OpenOptions } from 'open';
import _open from 'open';
import vscode, { Uri } from 'vscode';
import { wslToWindows } from 'wsl-path';

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
    // On Windows, vscode.env.openExternal cannot handle non-ASCII characters (e.g. Chinese) in file paths.
    // Fallback to open pkg which uses ShellExecute and handles Unicode paths correctly.
    // https://github.com/microsoft/vscode/issues/88273
    if (isWindows && /[\u0080-\uFFFF]/.test(filePath)) {
        logger.info('file path contains non-ASCII characters, fallback to open pkg on Windows');
        return openByPkg(filePath);
    }
    logger.info('open file by vscode builtin api');
    return vscode.env.openExternal(Uri.file(filePath));
}

export async function open(filePath: string, appConfig?: string | ExternalAppConfig) {
    logger.info(`opened file is: "${filePath}"`);

    // Convert WSL path to Windows path if needed (only once at the beginning)
    // Default is true to support Windows applications in WSL (the most common use case)
    let convertedPath = filePath;
    if (vscode.env.remoteName === 'wsl') {
        const shouldConvert =
            typeof appConfig === 'object' ? appConfig.wslConvertWindowsPath !== false : true;

        if (shouldConvert) {
            convertedPath = await wslToWindows(filePath, { wslCommand: 'wsl.exe' });
        }
    }

    if (typeof appConfig === 'string') {
        await openByPkg(convertedPath, {
            app: {
                name: appConfig,
            },
        });
    } else if (appConfig !== null && typeof appConfig === 'object') {
        if (appConfig.isElectronApp) {
            await openByBuiltinApi(convertedPath);
        } else if (appConfig.shellCommand) {
            const parsedCommand = (
                await parseVariables([appConfig.shellCommand!], Uri.file(convertedPath))
            )[0];
            logger.info(`open file by shell command: "${parsedCommand}"`);
            // On Windows, switch console codepage to UTF-8 (65001) so that
            // non-ASCII characters (e.g. Chinese) in file paths are handled correctly.
            const execCommand = isWindows ? `chcp 65001 > nul && ${parsedCommand}` : parsedCommand;
            try {
                if (appConfig.shellEnv) {
                    const shellEnv = getShellEnv();

                    let additionalEnv: NodeJS.ProcessEnv;
                    if (isWindows && typeof appConfig.shellEnv.windows === 'object') {
                        additionalEnv = appConfig.shellEnv.windows;
                    } else if (isMacintosh && typeof appConfig.shellEnv.osx === 'object') {
                        additionalEnv = appConfig.shellEnv.osx;
                    } else if (isLinux && typeof appConfig.shellEnv.linux === 'object') {
                        additionalEnv = appConfig.shellEnv.linux;
                    } else {
                        additionalEnv = appConfig.shellEnv as NodeJS.ProcessEnv;
                    }

                    await mergeEnvironments(shellEnv, additionalEnv, Uri.file(convertedPath));
                    const options: ExecOptions = { env: shellEnv };
                    await exec(execCommand, options);
                } else {
                    await exec(execCommand);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `open file by shell command failed, execute: "${parsedCommand}"`,
                );
                logger.info(error);
            }
        } else if (appConfig.openCommand) {
            const args = await parseVariables(appConfig.args ?? [], Uri.file(convertedPath));
            await openByPkg(convertedPath, {
                app: {
                    name: appConfig.openCommand,
                    arguments: args,
                },
            });
        }
    } else if (vscode.env.remoteName === 'wsl') {
        await openByPkg(convertedPath);
    } else {
        // On Windows, openByBuiltinApi internally falls back to open pkg for non-ASCII paths.
        await openByBuiltinApi(convertedPath);
    }
}
