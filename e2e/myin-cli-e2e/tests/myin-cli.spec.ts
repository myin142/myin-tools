import * as fs from 'fs-extra';
import { replaceFiles } from '@myin/myin-cli';

describe('myin-cli e2e', () => {
    let tmp: string;

    beforeAll(async () => {
        tmp = await fs.mkdtemp('myin-cli-e2e');
    });

    beforeEach(async () => {
        await fs.emptyDir(tmp);
    });

    afterAll(async () => {
        await fs.remove(tmp);
    });

    describe('Files', () => {
        it('replace existing path in target directory', async () => {
            await createFiles('target', [
                { file: 'folder1/file', data: 'Folder 1' },
                { file: 'folder2/file', data: 'Folder 2' },
                { file: 'root', data: 'Root' },
            ]);

            await createFiles('source', [
                { file: 'folder1/file', data: 'New Folder 1' },
                { file: 'root', data: 'New Root' },
            ]);

            await replaceFiles.handler({
                directory: `${tmp}/source`,
                target: `${tmp}/target`,
            });

            await expectFiles('target', [
                { file: 'folder1/file', data: 'New Folder 1' },
                { file: 'folder2/file', data: 'Folder 2' },
                { file: 'root', data: 'New Root' },
            ]);
        });

        // Currently only compares one level
        it('not replace excluded path in target directory', async () => {
            await createFiles('target', [
                { file: 'root', data: 'Root' },
                { file: 'excluded', data: 'Excluded' },
            ]);

            await createFiles('source', [
                { file: 'root', data: '' },
                { file: 'excluded', data: '' },
                { file: 'folder/excluded', data: '' },
            ]);

            await replaceFiles.handler({
                directory: `${tmp}/source`,
                target: `${tmp}/target`,
                exclude: ['excluded'],
            });

            await expectFiles('target', [
                { file: 'root', data: '' },
                { file: 'excluded', data: 'Excluded' },
            ]);
        });
    });

    async function expectFiles(dir: string, files: FileData[]) {
        return Promise.all(
            files.map(async (file) => {
                const path = `${tmp}/${dir}/${file.file}`;
                const data = await fs.readFile(path, 'UTF-8');
                expect(data).toEqual(file.data);
            })
        );
    }

    async function createFiles(dir: string, files: FileData[]): Promise<string[]> {
        return Promise.all(
            files.map(async (file) => {
                const path = `${tmp}/${dir}/${file.file}`;
                await fs.createFile(path);
                await fs.writeFile(path, file.data);
                return path;
            })
        );
    }
});

interface FileData {
    file: string;
    data: string;
}
