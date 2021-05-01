import vscode, { Uri } from 'vscode';
import _open from 'open';

// FIXME: support none-ascii character path
export function open(filePath: string, appConfig?: string | ExternalAppConfig): void {
    if (typeof appConfig === 'string') {
        _open(filePath, {
            app: {
                name: appConfig,
            },
        });
    } else if (appConfig !== null && typeof appConfig === 'object') {
        if (appConfig.isElectronApp) {
            vscode.env.openExternal(Uri.file(filePath));
        } else if (appConfig.openCommand) {
            _open(filePath, {
                app: {
                    name: appConfig.openCommand,
                    arguments: appConfig.args ?? [],
                },
            });
        }
    } else {
        _open(filePath);
    }
}

export function isAsciiString(str: string): boolean {
    return [...str].every((char) => char.codePointAt(0)! <= 255);
}
