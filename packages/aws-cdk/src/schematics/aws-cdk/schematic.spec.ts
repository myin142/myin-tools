import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { AwsCdkSchematicSchema } from './schema';

describe('aws-cdk schematic', () => {
  let appTree: Tree;
  const options: AwsCdkSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nx-plug/aws-cdk',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('aws-cdk', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
