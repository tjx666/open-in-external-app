import openInExternalApp from '../openInExternalApp';
import { parseArgs } from './open';

const command: CommandModule = {
    identifier: 'openMultiple',
    async handler(...args: any[]): Promise<void> {
        return openInExternalApp(...parseArgs(args), true);
    },
};

export default command;
