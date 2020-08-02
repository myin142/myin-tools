#!/usr/bin/env node

import { scriptName } from 'yargs';
import { CliCommand } from './command';
import { ReplaceFiles } from './lib/files/replace-files';
import { PublishPackage } from './lib/npm/publish-package';

const commands: CliCommand<unknown>[] = [new ReplaceFiles(), new PublishPackage()];

let cli = scriptName('myin-cli');

commands.forEach((cmd) => {
    cli = cli.command(
        cmd.command,
        cmd.description,
        (y) => cmd.setup(y),
        (a) => cmd.handler(a)
    );
});

cli.argv;

export * from './lib/files/replace-files';
export * from './lib/npm/publish-package';
