import { CliCommand } from '../../command';
import { Arguments, Argv } from 'yargs';
import { execSync } from 'child_process';
import fsExtra from 'fs-extra';

export class GithubDeploy implements CliCommand<GithubDeployArgv> {
    command = 'githubDeploy';
    description = 'Deploy folder to github pages';

    constructor(private fs: typeof fsExtra = fsExtra) { }

    setup(yargs: Argv<GithubDeployArgv>) {
        yargs.option('repo', {
            type: 'string',
            description: 'repository for deployment (user/project.git)',
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
            })
            .alias('b', 'branch')
            .option('branch', {
                type: 'string',
                description: 'Branch to clone and deploy',
                demandOption: true,
            })
            .option('cloneTarget', {
                type: 'string',
                description: 'Target folder to clone the repo',
                default: 'myin-cli-github-deploy'
            })
            .alias('c', 'clean')
            .option('clean', {
                type: 'boolean',
                description: 'Clean cloned repository before copy and deploy',
                default: true,
            })
            ;
    }

    async handler({ apiKey, branch, clean, directory, repo, cloneTarget: clonedFolder }: Partial<Arguments<GithubDeployArgv>>) {
        if (!(await this.fs.pathExists(directory))) {
            console.log('Directory to deploy does not exist');
            return;
        }

        console.log('Cloning repository');
        execSync(`git clone --quiet --branch=${branch} https://${apiKey}@github.com/${repo}.git ${clonedFolder}`);
        if (!(await this.fs.pathExists(clonedFolder))) {
            console.log('Failed to clone repository');
            return;
        }

        if (clean) {
            console.log('Cleaning repository');
            const files = await this.fs.readdir(clonedFolder);
            await Promise.all(files.map(f => {
                return this.fs.remove(`${clonedFolder}/${f}`);
            }));
        }

        console.log('Copying files');
        await this.fs.copy(directory, clonedFolder, { overwrite: true });

        console.log('Committing and pushing to repository');
        execSync(`cd ${clonedFolder} && git add -f . && git commit -m 'Github Deploy'`);
        execSync(`git push -f origin ${branch}`);
    }

}

export interface GithubDeployArgv {
    apiKey: string;
    repo: string;
    directory: string;
    cloneTarget: string;
    branch: string;
    clean: boolean;
}