import glob from 'glob';
import Mocha from 'mocha';
import path from 'path';

export function run(): Promise<void> {
    const mocha = new Mocha({ color: true });
    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((resolve, reject) => {
        glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            for (const f of files) {
                mocha.addFile(path.resolve(testsRoot, f));
            }

            try {
                mocha.run((failures) => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    } else {
                        resolve();
                    }
                });
            } catch (testErr) {
                reject(testErr);
            }
        });
    });
}
