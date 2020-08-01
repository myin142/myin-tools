import * as yargs from 'yargs';
import { Arguments } from 'yargs';

export interface CliCommand<T> {
    name: string;
    description: string;
    setup: (y: typeof yargs) => void;
    handler: (argv: Partial<Arguments<T>>) => void;
}
