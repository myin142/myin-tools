import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
	scheduleTargetAndForget,
	targetFromTargetString,
} from '@angular-devkit/architect';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NpmPublishBuilderSchema } from './schema';
import { PublishPackage } from '@myin/cli';

export function buildTarget(context: BuilderContext, target: string): Observable<BuilderOutput> {
	return target
		? scheduleTargetAndForget(context, targetFromTargetString(target))
		: (of({ success: true } as BuilderOutput) as any);
}

export function npmPublishBuilder(
	options: NpmPublishBuilderSchema,
	context: BuilderContext
): Observable<BuilderOutput> {
	return buildTarget(context, options.target).pipe(
		switchMap(() => from(new PublishPackage().handler({ directory: options.directory, firstPublish: options.firstPublish }))),
		map(() => ({ success: true }))
	);
}

export default createBuilder(npmPublishBuilder);
