import * as vscode from 'vscode';
import joi from 'joi';

export function validateConfiguration(configuration: ExtensionConfigItem[]) {
    const configScheme = joi.array().items(
        joi.object({
            extensionName: joi.string().required(),
            apps: joi
                .alternatives()
                .try([
                    joi.string(),
                    joi.array().items(
                        joi.object({
                            title: joi.string().required(),
                            openCommand: joi.string().required(),
                            args: joi.array().items(joi.string().required()),
                            isElectronApp: joi.boolean(),
                        }),
                    ),
                ])
                .required(),
        }),
    );

    return configScheme.validate(configuration);
}

export default function getExtensionConfig() {
    const configuration: ExtensionConfigItem[] | undefined = vscode.workspace
        .getConfiguration()
        .get('openInExternalApp.openMapper');

    if (configuration) {
        const result = validateConfiguration(configuration);
        if (result.error) {
            vscode.window.showErrorMessage(`Your configuration format isn't correct`);
            vscode.window.showErrorMessage(result.error.message);
            return null;
        }

        return configuration;
    }

    return null;
}
