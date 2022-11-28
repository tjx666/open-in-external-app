import vscode from 'vscode';

import openInExternalApp from '../openInExternalApp';
import { isObject } from '../utils';

type Uri = vscode.Uri;

export function parseArgs(args: any[]): [Uri | undefined, string | undefined] {
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

    return [uri, configItemId];
}

const command: CommandModule = {
    identifier: 'open',
    async handler(...args: any[]): Promise<void> {
        return openInExternalApp(...parseArgs(args), false);
    },
};

export default command;
