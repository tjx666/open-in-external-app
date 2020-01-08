import assert from 'assert';
import { isRepeat } from '../src/utils';

describe('# test sample', () => {
    describe('#isRepeat', () => {
        it('#should isRepeat([]) return false', () => {
            assert(!isRepeat([]));
        });

        it('#should isRepeat([1, 2, 1]) return true', () => {
            assert(isRepeat([1, 2, 1]));
        });

        it('#should return false as objects are not equals using ===', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }, { name: 'ly' }];
            assert(!isRepeat(testArray));
        });

        it('#should return false as not includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }];
            assert(!isRepeat(testArray, (a, b) => a.name === b.name));
        });

        it('#should return true as includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }, { name: 'ly' }];
            assert(isRepeat(testArray, (a, b) => a.name === b.name));
        });
    });
});
