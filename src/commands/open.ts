import vscode from 'vscode';

import { logger } from '../logger';
import openInExternalApp from '../openInExternalApp';
import { isObject } from '../utils';

type Uri = vscode.Uri;

export function parseArgs(args: any[]) {
    let uri: Uri | undefined;
    let configItemId: string | undefined;

    for (const arg of args) {
        if (isObject(arg)) {
            if (typeof arg.scheme === 'string') {
                uri = arg;
            } else if (typeof arg.configItemId === 'string') {
                configItemId = arg.configItemId;
            }
        }
    }
    const result = [uri, configItemId] as const;
    logger.log('parsed args: ' + JSON.stringify(result, undefined, 4));
    return result;
}

const command: CommandModule = {
    identifier: 'open',
    async handler(...args: any[]): Promise<void> {
        return openInExternalApp(...parseArgs(args), false);
    },
};

export default command;
