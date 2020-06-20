import { JsonObject } from '@angular-devkit/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeployBuilderSchema extends JsonObject {
    stack: string;
}
