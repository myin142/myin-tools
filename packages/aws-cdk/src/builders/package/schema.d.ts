import { JsonObject } from '@angular-devkit/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageBuilderSchema extends JsonObject {
    tsConfig: string;
    packageJson: string;
    outputPath: string;
    entryFile: string;
}
