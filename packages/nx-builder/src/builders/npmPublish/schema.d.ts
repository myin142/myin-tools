import { JsonObject } from '@angular-devkit/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NpmPublishBuilderSchema extends JsonObject {
    target: string;
    directory: string;
}
