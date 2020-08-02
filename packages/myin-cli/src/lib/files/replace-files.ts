import * as fs from 'fs-extra';
import { CliCommand } from '../../command';
import { globMatch } from '@myin/utils';
import { Arguments, Argv } from 'yargs';

export class ReplaceFiles implements CliCommand<ExecuteFilesArgv> {
    name = 'replaceFiles';
    description = 'Replace files/folder in a directory';

    constructor(private file: typeof fs = fs) {}

    setup(yargs: Argv<ExecuteFilesArgv>) {
        yargs
            .alias('d', 'directory')
            .option('directory', {
                type: 'string',
                description: 'Directory files to copy to target',
                demandOption: true,
            })
            .alias('t', 'target')
            .option('target', {
                type: 'string',
                description: 'Directory where files will be replaced',
                demandOption: true,
            })
            .option('exclude', {
                type: 'array',
                description: 'Files to exclude, matches for first level files',
            });
    }

    async handler({ directory, target, exclude = [] }: Partial<Arguments<ExecuteFilesArgv>>) {
        if (!(await this.file.pathExists(directory))) {
            console.log(`Specified directory '${directory}' does not exist`);
            return;
        }

        return Promise.all(
            this.file.readdirSync(directory).map(async (file) => {
                const source = `${directory}/${file}`;
                const dest = `${target}/${file}`;

                if (exclude.some((r) => globMatch(file, r))) return;

                if (await this.file.pathExists(dest)) {
                    await this.file.remove(dest);
                }

                await this.file.copy(source, dest);
            })
        );
    }
}

export interface ExecuteFilesArgv {
    target: string;
    directory: string;
    exclude?: string[];
}
