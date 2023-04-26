import type { OutputChannel } from 'vscode';
import vscode from 'vscode';

class Logger {
    channel: OutputChannel | undefined;

    constructor(private name = '', private language = 'log') {}

    private _initChannel() {
        const prefix = 'Open in External App';
        this.channel = vscode.window.createOutputChannel(
            `${prefix} ${this.name}`.trim(),
            this.language,
        );
    }

    private _output(message: string, active: boolean, level: string): void {
        if (this.channel === undefined) {
            this._initChannel();
        }

        this.channel!.append(`[${level}] ${message}\n`);
        if (active) {
            this.channel!.show();
        }
    }

    info(message: string, active = false) {
        this._output(message, active, 'INFO');
    }

    error(message: string, active = false) {
        this._output(message, active, 'ERROR');
    }

    dispose(): void {
        this.channel?.dispose();
    }
}

export const logger = new Logger();
