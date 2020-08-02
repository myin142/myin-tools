#!/usr/bin/env node

import { scriptName } from 'yargs';
import { CliCommand } from './command';
import { ReplaceFiles } from './lib/files/replace-files';

const commands: CliCommand<unknown>[] = [new ReplaceFiles()];

let cli = scriptName('myin-cli');

commands.forEach(({ name, description, handler, setup }) => {
    cli = cli.command(name, description, setup, handler);
});

cli.argv;

export * from './lib/files/replace-files';
