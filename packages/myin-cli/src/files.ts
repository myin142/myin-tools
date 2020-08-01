import * as fs from 'fs-extra';
import { CliCommand } from './command';

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
            });
    },
    handler: async (argv) => {
        const dir = argv.directory;
        const target = argv.target;

        return Promise.all(
            fs.readdirSync(dir).map(async (file) => {
                const source = `${dir}/${file}`;
                const dest = `${target}/${file}`;
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
}
