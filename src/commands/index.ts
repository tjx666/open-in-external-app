import open from './open';

const commands: CommandModule[] = [open];
commands.forEach(command => {
    command.identifier = `openInExternalApp.${command.identifier}`;
});

export default commands;
