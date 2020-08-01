import { scriptName } from 'yargs';
import { CliCommand } from './command';
import { replaceFiles } from './files';

const commands: CliCommand<unknown>[] = [replaceFiles];

let cli = scriptName('myin-cli');

commands.forEach(({ name, description, handler, setup }) => {
    cli = cli.command(name, description, setup, handler);
});

export default cli;
export * from './files';
