import { PublishPackage } from './publish-package';
import { MockProxy, mock } from 'jest-mock-extended';
import * as npmModule from 'npm';
import * as fsModule from 'fs-extra';

describe('Publish Package', () => {
	let publishPackage: PublishPackage;
	let npm: MockProxy<typeof npmModule>;
	let fs: MockProxy<typeof fsModule>;

	beforeEach(() => {
		npm = mock<typeof npmModule>({}, { deep: true });
		fs = mock();
		publishPackage = new PublishPackage(npm, fs);

		npm.load.mockImplementation((x, cb) => cb());
		npm.commands.publish.mockImplementation((x, cb) => cb());
		fs.pathExists.mockResolvedValue(true as never);
	});

	// it('publish package if version is different', async () => {
	//     fs.readJson.mockResolvedValueOnce({ name: '@test/package', version: '1' } as never);
	//     npm.commands.view.mockImplementationOnce(((x, cb) =>
	//         cb(null, { '0': { version: '0' } })) as typeof npmModule.commands.view);

	//     await publishPackage.handler({ directory: 'package/folder' });

	//     expect(npm.commands.publish).toHaveBeenCalledWith(['package/folder'], expect.anything());
	// });

	// it('not publish if directory not exist', async () => {
	//     fs.pathExists.mockResolvedValueOnce(false as never);
	//     fs.readJson.mockResolvedValueOnce({ name: '@test/package', version: '1' } as never);
	//     npm.commands.view.mockImplementationOnce(((x, cb) =>
	//         cb(null, { '0': { version: '0' } })) as typeof npmModule.commands.view);

	//     await publishPackage.handler({ directory: 'package/folder' });

	//     expect(npm.commands.publish).not.toHaveBeenCalled();
	// });

	// it('not publish if same version', async () => {
	//     fs.readJson.mockResolvedValueOnce({ name: '@test/package', version: '1' } as never);
	//     npm.commands.view.mockImplementationOnce(((x, cb) =>
	//         cb(null, { '1': { version: '1' } })) as typeof npmModule.commands.view);

	//     await publishPackage.handler({ directory: 'package/folder' });

	//     expect(npm.commands.publish).not.toHaveBeenCalled();
	// });
});
