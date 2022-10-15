import vscode from 'vscode';
import { init } from 'vscode-nls-i18n';

import commands from './commands';

export function activate(context: vscode.ExtensionContext): void {
    init(context.extensionPath);
    commands.forEach((command) => {
        context.subscriptions.push(vscode.commands.registerCommand(command.identifier!, command.handler));
    });
}

export function deactivate(): void {
    // ...recycle resource
}
