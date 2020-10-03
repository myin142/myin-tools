import { ReplaceFiles } from './replace-files';
import { mock, MockProxy } from 'jest-mock-extended';
import * as fs from 'fs-extra';
import 'jest-extended';

describe('Replace Files', () => {
	let replaceFiles: ReplaceFiles;
	let file: MockProxy<typeof fs>;

	beforeEach(() => {
		file = mock();
		replaceFiles = new ReplaceFiles(file);
	});

	it('do nothing if source directory does not exist', async () => {
		file.pathExists.mockResolvedValue(false as never);
		file.readdirSync.mockReturnValueOnce(['file']);

		await replaceFiles.handler({
			directory: 'source',
			target: 'dest',
		});

		expect(file.copy).not.toHaveBeenCalled();
	});

	it('copy source to destination', async () => {
		file.pathExists.mockResolvedValue(true as never);
		file.readdirSync.mockReturnValueOnce(['file1', 'file2']);

		await replaceFiles.handler({
			directory: 'source',
			target: 'dest',
		});

		expect(file.copy).toHaveBeenCalledWith('source/file1', 'dest/file1');
		expect(file.copy).toHaveBeenCalledWith('source/file2', 'dest/file2');
	});

	it('not copy excluded files', async () => {
		file.pathExists.mockResolvedValue(true as never);
		file.readdirSync.mockReturnValueOnce(['file1', 'file2']);

		await replaceFiles.handler({
			directory: 'source',
			target: 'dest',
			exclude: ['file1'],
		});

		expect(file.copy).toHaveBeenCalledWith('source/file2', 'dest/file2');
		expect(file.copy).toHaveBeenCalledTimes(1);
	});

	it('remove files before copying', async () => {
		file.pathExists.mockResolvedValue(true as never);
		file.readdirSync.mockReturnValueOnce(['file']);

		await replaceFiles.handler({
			directory: 'source',
			target: 'dest',
		});

		expect(file.remove).toHaveBeenCalledWith('dest/file');
		expect(file.remove).toHaveBeenCalledBefore(file.copy);
	});
});
