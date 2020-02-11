import { resolve } from 'path';
import { runTests } from 'vscode-test';

(async function go() {
    const projectPath = resolve(__dirname, '../../');
    const extensionDevelopmentPath = projectPath;
    const extensionTestsPath = resolve(projectPath, './out/test/index.js');
    const testWorkspace = resolve(projectPath, './test-fixture');

    try {
        await runTests({
            version: 'insiders',
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [testWorkspace],
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
})();
