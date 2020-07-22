import { Linter } from '@nrwl/workspace';

export interface LambdaSchema {
  name: string;
  tags?: string;
  directory?: string;
  linter?: Linter;
}
