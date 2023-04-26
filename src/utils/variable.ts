/* eslint-disable no-template-curly-in-string */
import { homedir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

import type { Uri } from 'vscode';
import vscode from 'vscode';

import { logger } from './logger';
import { getActiveFileUri } from './uri';

export async function parseVariables(strList: string[], activeFile?: Uri) {
    const replacement: Map<
        string | RegExp,
        string | ((substring: string, ...args: any[]) => string) | undefined
    > = new Map([
        ['${userHome}', homedir()],
        ['${pathSeparator}', path.sep],
    ]);

    const { workspaceFolders } = vscode.workspace;
    if (workspaceFolders?.length) {
        const workspaceFolder = workspaceFolders[0];
        replacement.set('${workspaceFolder}', workspaceFolder.uri.fsPath);
        replacement.set('${workspaceFolderBasename}', workspaceFolder.name);
    }

    const { activeTextEditor } = vscode.window;
    activeFile ??= activeTextEditor?.document?.uri ?? (await getActiveFileUri());
    const absoluteFilePath = activeFile?.fsPath;
    replacement.set('${file}', absoluteFilePath);

    const activeWorkspace = activeFile
        ? vscode.workspace.getWorkspaceFolder(activeFile)
        : undefined;
    replacement.set('${fileWorkspaceFolder}', activeWorkspace?.uri.fsPath);
    replacement.set('${cwd}', activeWorkspace?.uri.fsPath);

    let relativeFilePath: string | undefined;
    if (absoluteFilePath && activeWorkspace) {
        relativeFilePath = absoluteFilePath
            .replace(activeWorkspace.uri.fsPath, '')
            .slice(path.sep.length);
        replacement.set('${relativeFile}', relativeFilePath);
    }

    if (relativeFilePath) {
        replacement.set(
            '${relativeFileDirname}',
            relativeFilePath.slice(0, relativeFilePath.lastIndexOf(path.sep)),
        );
    }

    if (absoluteFilePath) {
        const parsedPath = path.parse(absoluteFilePath);
        replacement.set('${fileBasename}', parsedPath.base);
        replacement.set('${fileBasenameNoExtension}', parsedPath.name);
        replacement.set('${fileExtname}', parsedPath.ext);
        replacement.set('${fileDirname}', parsedPath.dir);
    }

    if (activeTextEditor) {
        replacement.set('${lineNumber}', String(activeTextEditor.selection.start.line + 1));

        const cursorPosition = activeTextEditor.selection.active;
        replacement.set('${cursorLineNumber}', String(cursorPosition.line + 1));
        replacement.set('${cursorColumnNumber}', String(cursorPosition.character + 1));

        replacement.set(
            '${selectedText}',
            activeTextEditor.document.getText(
                new vscode.Range(activeTextEditor.selection.start, activeTextEditor.selection.end),
            ),
        );
    }

    replacement.set(/\$\{env:(.*?)\}/g, (...captures) => process.env[captures[1]] ?? captures[0]);
    replacement.set(/\$\{config:(.*?)\}/g, (...captures) =>
        vscode.workspace.getConfiguration().get(captures[1], captures[0]),
    );

    const replacementEntries = [...replacement.entries()].filter(([_, r]) => r !== undefined);
    const replace = (str: string) => {
        for (const [search, replacer] of replacementEntries) {
            const typeofReplacer = typeof replacer;
            if (typeofReplacer === 'string') {
                str = str.replaceAll(search, replacer as string);
            } else if (typeofReplacer === 'function') {
                str = str.replaceAll(search as RegExp, replacer as any);
            }
        }
        return str;
    };

    for (let [index, str] of strList.entries()) {
        str = replace(str);
        strList[index] = str;
    }

    const variables = [
        'userHome',
        'workspaceFolder',
        'workspaceFolderBasename',
        'file',
        'fileWorkspaceFolder',
        'relativeFile',
        'relativeFileDirname',
        'fileBasename',
        'fileBasenameNoExtension',
        'fileDirname',
        'fileExtname',
        'cwd',
        'lineNumber',
        'selectedText',
        'execPath',
        'defaultBuildTask',
        'pathSeparator',
        'cursorLineNumber',
        'cursorColumnNumber',
    ]
        .map((variable) => `\t${variable}: \${${variable}}`)
        .join('\n');
    logger.info(`variables:\n${replace(variables)}`);

    return strList;
}
