import { equal } from 'assert';
import * as vscode from 'vscode';

describe('# test sample', () => {
    before(() => {
        vscode.window.showInformationMessage('Test begin!');
    });

    it('one plus one equals two', () => {
        equal(2, 1 + 1);
    });

    after(() => {
        vscode.window.showInformationMessage('Test end!');
    });
});
