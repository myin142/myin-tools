import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

export const runner = new SchematicTestRunner(
    '@nx-plug/aws-cdk',
    join(__dirname, '../../collection.json'),
);