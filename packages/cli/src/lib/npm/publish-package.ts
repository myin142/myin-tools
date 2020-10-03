import * as npmModule from 'npm';
import * as fsModule from 'fs-extra';
import { CliCommand } from '../../command';
import { Argv, Arguments } from 'yargs';

export class PublishPackage implements CliCommand<PublishPackageArgv> {
	command = 'publishPackage <directory>';
	description = 'Publish NPM package if version has changed';

	constructor(
		private npm: typeof npmModule = npmModule,
		private fs: typeof fsModule = fsModule
	) { }

	setup(y: Argv<PublishPackageArgv>) {
		y.positional('directory', {
			type: 'string',
			description: 'Directory to publish (should contain a package.json)',
			demandOption: true,
		});
	}

	async handler({ directory, firstPublish }: Partial<Arguments<PublishPackageArgv>>) {
		if (!(await this.fs.pathExists(directory))) {
			console.log('Directory does not exist');
			return;
		}

		const { name, version } = await this.fs.readJson(`${directory}/package.json`);
		console.log(`Publish version ${version} of package ${name}`);

		return new Promise((resolve, reject) => {

			if (firstPublish) {
				console.log(`Publish package first time in ${firstPublish} mode`);

				this.npm.commands.publish([directory, '--access', firstPublish], (err, result) => {
					if (err) {
						console.log(`Failed to publish first version of package in ${firstPublish} mode`);
						reject();
						return;
					}

					console.log(`Published first version of package in ${firstPublish} mode`);
					resolve();
				});

				return;
			}

			this.npm.load({ prefix: directory }, () => {
				this.npm.commands.view([name, 'version'], (err, publish) => {
					if (err) {
						console.log(`Failed to get version of package ${name}`);
						reject(err);
						return;
					}

					if (version === Object.keys(publish)[0]) {
						console.log('Version did not change. Skip publish');
						resolve();
						return;
					}

					console.log('Publishing package');
					this.npm.commands.publish([directory], (err, result) => {
						if (err) {
							console.log('Publish failed', err);
							reject(err);
						} else {
							console.log(`Successfully publishd package ${name}@${version}`);
							resolve();
						}
					});
				});
			});
		});
	}
}

export interface PublishPackageArgv {
	directory: string;
	firstPublish?: string;
}
