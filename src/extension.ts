import * as vscode from 'vscode';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    console.log('active extension');
    commands.forEach(command => {
        context.subscriptions.push(vscode.commands.registerCommand(command.identifier!, command.handler));
    });
}

export function deactivate() {
    // ...recycle resource
}
