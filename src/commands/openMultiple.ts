import { parseArgs } from './open';
import openInExternalApp from '../openInExternalApp';

const command: CommandModule = {
    identifier: 'openMultiple',
    async handler(...args: any[]): Promise<void> {
        return openInExternalApp(...parseArgs(args), true);
    },
};

export default command;
