import * as vscode from 'vscode';
import { OutputChannel } from 'vscode';

let outputChannel: OutputChannel | undefined;
export const logger = {
    log(message: string): void {
        if (outputChannel === undefined) {
            outputChannel = vscode.window.createOutputChannel('Open in External App');
        }
        outputChannel.append(`${message}\n`);
    },
    dispose(): void {
        outputChannel?.dispose();
    },
};
