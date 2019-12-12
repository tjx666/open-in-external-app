import * as vscode from 'vscode';
import commands from './commands';

const activate = (context: vscode.ExtensionContext) => {
    commands.forEach(command =>
        context.subscriptions.push(vscode.commands.registerCommand(command.identifier, command.handler))
    );
};

const deactivate = () => {
    // recycle resource...
};

export { activate, deactivate };
