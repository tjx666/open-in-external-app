import assert from 'assert';
import { isRepeat, isAsciiString } from '../src/utils';

describe('#util', () => {
    describe('#isRepeat', () => {
        it('should isRepeat([]) return false', () => {
            assert.strictEqual(isRepeat([]), false);
        });

        it('should isRepeat([1, 2, 1]) return true', () => {
            assert.ok(isRepeat([1, 2, 1]));
        });

        it('should return false as objects are not equals using ===', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }, { name: 'ly' }];
            assert.strictEqual(isRepeat(testArray), false);
        });

        it('should return false as not includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }];
            assert.strictEqual(
                isRepeat(testArray, (a, b) => a.name === b.name),
                false,
            );
        });

        it('should return true as includes two same Object', () => {
            const testArray = [{ name: 'ly' }, { name: 'lily' }, { name: 'ly' }];
            assert.ok(isRepeat(testArray, (a, b) => a.name === b.name));
        });
    });

    describe('isAsciiString', () => {
        it('should return true when given string is combined by ascii character', () => {
            assert.ok(isAsciiString(''));
            assert.ok(isAsciiString('abc'));
        });

        it('should return false when given string includes non-ascii character', () => {
            assert.strictEqual(isAsciiString('Untitled—2.php'), false);
            assert.strictEqual(isAsciiString('汉字'), false);
        });
    });
});
