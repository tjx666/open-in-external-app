import * as vscode from 'vscode';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    commands.forEach(command =>
        context.subscriptions.push(vscode.commands.registerCommand(command.identifier, command.handler))
    );
}

export function deactivate() {
    // recycle resource...
}
