import joi from 'joi';
import vscode from 'vscode';
import { localize } from 'vscode-nls-i18n';

export function validateConfiguration(configuration: ExtensionConfigItem[]): joi.ValidationResult {
    const configScheme = joi.array().items(
        joi.object({
            id: joi.string(),
            extensionName: joi
                .alternatives()
                .try(joi.string(), joi.array().items(joi.string()))
                .required(),
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
                            shellEnv: joi
                                .alternatives()
                                .try(
                                    joi.object()
                                        .pattern(
                                            joi.string(),
                                            joi.string().required()
                                        ),
                                    joi.object({
                                        windows: joi.object()
                                            .pattern(
                                                joi.string(),
                                                joi.string().required()
                                            ),
                                        osx: joi.object()
                                            .pattern(
                                                joi.string(),
                                                joi.string().required()
                                            ),
                                        linux: joi.object()
                                            .pattern(
                                                joi.string(),
                                                joi.string().required()
                                            )
                                    })
                                )
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
