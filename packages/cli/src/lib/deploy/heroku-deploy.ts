import { CliCommand } from '../../command';
import { Arguments, Argv } from 'yargs';
import { execSync } from 'child_process';

export class HerokuDeploy implements CliCommand<HerokuDeployArgv> {
    command = 'herokuDeploy';
    description = 'Deploy folder to heroku';

    setup(yargs: Argv<HerokuDeployArgv>) {
        yargs.alias('a', 'app')
            .option('app', {
                type: 'string',
                description: 'App to deploy',
                demandOption: true,
            })
            .alias('k', 'apiKey')
            .option('apiKey', {
                type: 'string',
                description: 'Api Key for deploying',
                demandOption: true,
            })
            .alias('d', 'directory')
            .option('directory', {
                type: 'string',
                description: 'Directory to deploy',
                demandOption: true,
            });
    }

    async handler({ apiKey, app, directory }: Partial<Arguments<HerokuDeployArgv>>) {
        execSync(`git remote add heroku https://heroku:${apiKey}@git.heroku.com/${app}.git`);
        execSync(`git add -f ${directory}`);
        execSync(`git commit -m 'Heroku deploy'`);
        execSync(`git push heroku \`git subtree split --prefix ${directory} HEAD\`:master --force`);
    }

}

export interface HerokuDeployArgv {
    apiKey: string;
    app: string;
    directory: string;
}