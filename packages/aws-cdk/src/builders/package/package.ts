/* eslint-disable @typescript-eslint/no-var-requires */
import {
    BuilderContext,
    BuilderOutput,
    createBuilder,
} from '@angular-devkit/architect';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PackageBuilderSchema } from './schema';
import { dirname, join } from 'path';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
    calculateProjectDependencies,
    checkDependentProjectsHaveBeenBuilt,
    DependentBuildableProjectNode,
} from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { readJsonFile, toClassName } from '@nrwl/workspace';
import * as rollup from 'rollup';
import * as npm from 'npm';

const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');

function createRollUpConfig(
    options: PackageBuilderSchema,
    context: BuilderContext,
    dependencies: DependentBuildableProjectNode[]
): rollup.RollupOptions {
    const entryRoot = dirname(options.entryFile);
    const packageJsonPath = join(entryRoot, 'package.json');

    const tsconfigPath = join(context.workspaceRoot, options.tsConfig);
    const packageJson = readJsonFile(packageJsonPath);
    const plugins = [
        typescript({
            check: true,
            tsconfig: tsconfigPath,
            tsconfigOverride: {
                compilerOptions: {
                    target: 'es2017', // keep asyc/await
                },
            },
        }),
        copy({
            targets: [
                { src: `${packageJsonPath}`, dest: `${options.outputPath}` },
            ],
        }),
    ];

    const externalPackages = dependencies
        .map((d) => d.name)
        .concat(Object.keys(packageJson.dependencies || {}));

    return {
        input: options.entryFile,
        output: {
            format: 'cjs', // build for nodejs
            file: `${options.outputPath}/${context.target.project}.js`,
            name: toClassName(context.target.project),
        },
        external: (id) => externalPackages.includes(id),
        plugins,
    };
}

export function runRollup(options: rollup.RollupOptions) {
    return from(rollup.rollup(options)).pipe(
        switchMap((bundle) => {
            const outputOptions = Array.isArray(options.output)
                ? options.output
                : [options.output];
            return from(Promise.all(outputOptions.map((o) => bundle.write(o))));
        }),
        map(() => ({ success: true }))
    );
}

export function packageBuilder(
    options: PackageBuilderSchema,
    context: BuilderContext
): Observable<BuilderOutput> {
    const projGraph = createProjectGraph();
    const { dependencies } = calculateProjectDependencies(projGraph, context);

    return of(checkDependentProjectsHaveBeenBuilt(context, dependencies)).pipe(
        switchMap((built) => {
            if (!built) return of({ success: false });
            const config = createRollUpConfig(options, context, dependencies);
            context.logger.info('Run rollup');
            return runRollup(config);
        }),
        switchMap(() => {
            return from<Promise<BuilderOutput>>(
                new Promise((resolve) => {
                    context.logger.info('Install packages');
                    npm.load({ prefix: options.outputPath }, () => {
                        npm.commands.install([], (err, data) => {
                            if (err) context.logger.info(err.message);
                            resolve({ success: err == null });
                        });
                    });
                })
            );
        })
    );
}

export default createBuilder(packageBuilder);
