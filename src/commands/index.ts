import open from './open';
import openMultiple from './openMultiple';

const commands: CommandModule[] = [open, openMultiple];
commands.forEach((command) => {
    command.identifier = `openInExternalApp.${command.identifier}`;
});

export default commands;
