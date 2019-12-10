import helloVSCode from './helloVSCode';

const commands: CommandModule[] = [helloVSCode];
commands.forEach(command => {
    command.identifier = `VSCodeExtensionBoilerplate.${command.identifier}`;
});

export default commands;
