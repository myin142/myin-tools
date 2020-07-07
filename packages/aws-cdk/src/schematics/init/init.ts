import { chain, Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { addDepsToPackageJson, addPackageWithInit } from '@nrwl/workspace';
import { CDK_VERSION } from '@nx-plug/cdk-shared';

export default function (schema: Schema): Rule {
    return chain([
        addPackageWithInit('@nrwl/jest'),
        addDepsToPackageJson({}, {
            '@aws-cdk/core': CDK_VERSION,
            '@aws-cdk/assert': CDK_VERSION,
        }),
    ]);
}