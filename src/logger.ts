import vscode from 'vscode';
import type { OutputChannel } from 'vscode';

let outputChannel: OutputChannel | undefined;
export const logger = {
    info(message: string): void {
        if (outputChannel === undefined) {
            outputChannel = vscode.window.createOutputChannel('Open in External App', 'log');
        }
        outputChannel.append(`[INFO] ${message}\n`);
    },
    dispose(): void {
        outputChannel?.dispose();
    },
};
