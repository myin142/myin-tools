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
    createTmpTsConfig,
} from '@nrwl/workspace/src/utils/buildable-libs-utils';
import * as rollup from 'rollup';
import * as peerDepsExternal from 'rollup-plugin-peer-deps-external';
import * as localResolve from 'rollup-plugin-local-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { readJsonFile, toClassName } from '@nrwl/workspace';

const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');
const commonjs = require('@rollup/plugin-commonjs');

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
                compilerOptions: {},
            },
        }),
        commonjs(),
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
            format: 'esm',
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
    const { target, dependencies } = calculateProjectDependencies(
        projGraph,
        context
    );

    return of(checkDependentProjectsHaveBeenBuilt(context, dependencies)).pipe(
        switchMap((built) => {
            if (!built) return of({ success: false });
            const config = createRollUpConfig(options, context, dependencies);
            return runRollup(config);
        })
    );
}

export default createBuilder(packageBuilder);
