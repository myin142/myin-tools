import * as fs from 'fs';
import { command, scriptName } from 'yargs';

scriptName('myin-cli').usage('$0 <cmd> [args]');
command(
    'executeFiles',
    'Execute command for files/folder in directory',
    (yargs) => {
        yargs.options('target', {
            type: 'string',
        });
    },
    (argv) => {
        console.log(argv);
    }
).argv;
