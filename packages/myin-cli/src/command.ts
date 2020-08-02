import { Arguments, Argv } from 'yargs';

export interface CliCommand<T> {
    command: string;
    description: string;
    setup: (y: Argv<T>) => void;
    handler: (argv: Partial<Arguments<T>>) => Promise<any>;
}
