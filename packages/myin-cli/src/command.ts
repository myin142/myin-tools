import { Arguments, Argv } from 'yargs';

export interface CliCommand<T> {
    name: string;
    description: string;
    setup: (y: Argv<T>) => void;
    handler: (argv: Partial<Arguments<T>>) => void;
}
