import {
    BuilderContext,
    BuilderOutput,
    createBuilder,
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeployBuilderSchema } from './schema';
import * as cdk from 'aws-cdk';

export function deployBuilder(options: DeployBuilderSchema, context: BuilderContext): Observable<BuilderOutput> {
    cdk.deployStack
    return of({ success: true }).pipe(
        tap(() => {
            context.logger.info('Builder ran for build');
        })
    );
}

export default createBuilder(deployBuilder);
