import vscode from 'vscode';
import joi from 'joi';
import { localize } from 'vscode-nls-i18n';

export function validateConfiguration(configuration: ExtensionConfigItem[]): joi.ValidationResult {
    const configScheme = joi.array().items(
        joi.object({
            extensionName: joi.alternatives().try(joi.string(), joi.array().items(joi.string())).required(),
            apps: joi
                .alternatives()
                .try(
                    joi.string(),
                    joi.array().items(
                        joi.object({
                            title: joi.string().required(),
                            openCommand: joi.string(),
                            args: joi.array().items(joi.string().required()),
                            isElectronApp: joi.boolean(),
                            shellCommand: joi.string(),
                        }),
                    ),
                )
                .required(),
        }),
    );

    return configScheme.validate(configuration);
}

export default function getExtensionConfig(): ExtensionConfigItem[] {
    const configuration: ExtensionConfigItem[] | undefined = vscode.workspace
        .getConfiguration()
        .get('openInExternalApp.openMapper');

    if (configuration) {
        const result = validateConfiguration(configuration);
        if (result.error) {
            vscode.window.showErrorMessage(localize('msg.error.configFormat'));
            vscode.window.showErrorMessage(result.error.message);
            return [];
        }

        return configuration;
    }

    return [];
}
