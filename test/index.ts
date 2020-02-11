import path from 'path';
import Mocha from 'mocha';
import glob from 'glob';

export function run(): Promise<void> {
    const mocha = new Mocha({ useColors: true });
    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line consistent-return
        glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                return reject(err);
            }

            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                mocha.run(failures => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    } else {
                        resolve();
                    }
                });
            } catch (testErr) {
                return reject(testErr);
            }
        });
    });
}
