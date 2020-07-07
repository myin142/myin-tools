import {
    checkFilesExist,
    ensureNxProject,
    readJson,
    runNxCommandAsync,
    uniq,
} from '@nrwl/nx-plugin/testing';
describe('aws-cdk e2e', () => {
    it('should create application', async (done) => {
        const plugin = uniq('aws-cdk');
        ensureNxProject('@nx-plug/aws-cdk', 'dist/packages/aws-cdk');
        await runNxCommandAsync(`generate @nx-plug/aws-cdk:application ${plugin}`);

        const result = await runNxCommandAsync(`build ${plugin}`);
        expect(result.stdout).toContain('Builder ran');
        done();
    });

    describe('--directory', () => {
        it('should create src in the specified directory', async (done) => {
            const plugin = uniq('aws-cdk');
            ensureNxProject('@nx-plug/aws-cdk', 'dist/packages/aws-cdk');
            await runNxCommandAsync(
                `generate @nx-plug/aws-cdk:application ${plugin} --directory subdir`
            );
            expect(() => checkFilesExist(`apps/subdir/${plugin}/src/main.ts`)).not.toThrow();
            done();
        });
    });

    describe('--tags', () => {
        it('should add tags to nx.json', async (done) => {
            const plugin = uniq('aws-cdk');
            ensureNxProject('@nx-plug/aws-cdk', 'dist/packages/aws-cdk');
            await runNxCommandAsync(
                `generate @nx-plug/aws-cdk:application ${plugin} --tags e2etag,e2ePackage`
            );
            const nxJson = readJson('nx.json');
            expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
            done();
        });
    });
});
