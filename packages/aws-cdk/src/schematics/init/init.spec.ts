import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { runner } from '../../utils/runner';

describe('init', () => {

    let tree: Tree;

    beforeEach(() => {
        tree = createEmptyWorkspace(Tree.empty());
    });

    it('should add dependencies', () => {
        const result = runner.runSchematic('init', {}, tree);
        const { dependencies, devDependencies } = readJsonInTree(result, 'package.json');

        expect(dependencies['@aws-cdk/core']).toBeDefined();
        expect(devDependencies['@aws-cdk/assert']).toBeDefined();
    });

});