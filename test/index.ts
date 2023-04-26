import path from 'node:path';

import { glob } from 'glob';
import Mocha from 'mocha';

export async function run(
    testsRoot: string,
    callback: (error: any, failures?: number) => void,
): Promise<void> {
    const mocha = new Mocha({ color: true });

    try {
        const files = await glob('**/**.test.js', { cwd: testsRoot });
        for (const f of files) {
            mocha.addFile(path.resolve(testsRoot, f));
        }
        mocha.run((failures) => {
            callback(null, failures);
        });
    } catch (error) {
        callback(error);
    }
}
