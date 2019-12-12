import assert from 'assert';
import * as vscode from 'vscode';
import { iSRepeat } from '../src/util';

describe('# test sample', () => {
    before(() => {
        vscode.window.showInformationMessage('Test begin!');
    });

    describe('#isRepeat', () => {
        it('#should isRepeat([]) return false', () => {
            assert(!iSRepeat([]));
        });

        it('#should isRepeat([1, 2, 1]) return true', () => {
            assert(iSRepeat([1, 2, 1]));
        });

        it('#should return false as not includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }];
            assert(!iSRepeat(testArray, (a, b) => a.name === b.name));
        });

        it('#should return true as includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }, { name: 'ly' }];
            assert(iSRepeat(testArray, (a, b) => a.name === b.name));
        });
    });

    after(() => {
        vscode.window.showInformationMessage('Test end!');
    });
});
