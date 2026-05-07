import type { Uri } from 'vscode';

import { parseVariables, type ParseVariablesOptions } from './variable';

let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;

switch (process.platform) {
    case 'win32':
        _isWindows = true;
        break;
    case 'darwin':
        _isMacintosh = true;
        break;
    case 'linux':
        _isLinux = true;
        break;
}

export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;

export function getShellEnv(): NodeJS.ProcessEnv {
    return { ...process.env };
}

export async function mergeEnvironments(
    parent: NodeJS.ProcessEnv,
    other: NodeJS.ProcessEnv | undefined,
    activeFile?: Uri,
    parseOptions?: ParseVariablesOptions,
) {
    if (!other) {
        return;
    }

    if (isWindows) {
        // In Windows, environment variables are not case sensitive, so
        // this must be taken into account when overwriting.
        await Promise.all(
            Object.entries(other).map(async ([key, value]) => {
                if (value !== undefined) {
                    let otherKey = key;
                    for (const envKey in parent) {
                        if (key.toLowerCase() === envKey.toLowerCase()) {
                            otherKey = envKey;
                            break;
                        }
                    }

                    await _mergeEnvironmentValue(parent, otherKey, value, activeFile, parseOptions);
                }
            }),
        );
    } else {
        await Promise.all(
            Object.entries(other).map(async ([key, value]) => {
                if (value !== undefined) {
                    await _mergeEnvironmentValue(parent, key, value, activeFile, parseOptions);
                }
            }),
        );
    }
}

async function _mergeEnvironmentValue(
    env: NodeJS.ProcessEnv,
    key: string,
    value: string | null,
    activeFile?: Uri,
    parseOptions?: ParseVariablesOptions,
): Promise<void> {
    if (typeof value === 'string') {
        const parsedValue = (await parseVariables([value], activeFile, parseOptions))[0];
        env[key] = parsedValue;
    } else {
        delete env[key];
    }
}
