import assert from 'assert';
import { isAsciiString } from '../src/utils';

describe('#util', () => {
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
