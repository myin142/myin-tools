import * as fs from 'fs-extra';
import { CliCommand } from './command';
import { globMatch } from '@myin/utils';

export const replaceFiles: CliCommand<ExecuteFilesArgv> = {
    name: 'replaceFiles',
    description: 'Replace files/folder in a directory',
    setup: (yargs) => {
        yargs
            .alias('d', 'directory')
            .option('directory', {
                type: 'string',
                demandOption: true,
            })
            .alias('t', 'target')
            .option('target', {
                type: 'string',
                demandOption: true,
            })
            .option('exclude', {
                type: 'array',
            });
    },
    handler: async ({ directory, target, exclude = [] }) => {
        return Promise.all(
            fs.readdirSync(directory).map(async (file) => {
                const source = `${directory}/${file}`;
                const dest = `${target}/${file}`;

                if (exclude.some((r) => globMatch(file, r))) return;

                if (await fs.pathExists(dest)) {
                    await fs.remove(dest);
                }

                await fs.copy(source, dest);
            })
        );
    },
};

export interface ExecuteFilesArgv {
    target: string;
    directory: string;
    exclude?: string[];
}
