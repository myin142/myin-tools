import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { ApplicationSchema } from './schema';
import { runner } from '../../utils/runner';

describe('Application', () => {
    let appTree: Tree;
    const options: ApplicationSchema = { name: 'test' };

    beforeEach(() => {
        appTree = createEmptyWorkspace(Tree.empty());
    });

    it('should run successfully', async () => {
        await expect(
            runner.runSchematicAsync('application', options, appTree).toPromise()
        ).resolves.not.toThrowError();
    });
});
