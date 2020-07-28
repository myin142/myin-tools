import {
    apply,
    applyTemplates,
    chain,
    mergeWith,
    move,
    Rule,
    url,
    externalSchematic,
    Tree,
    forEach,
} from '@angular-devkit/schematics';
import {
    names,
    offsetFromRoot,
    projectRootDir,
    ProjectType,
    toFileName,
    addDepsToPackageJson,
    updateWorkspaceInTree,
} from '@nrwl/workspace';
import { LambdaSchema } from './schema';
import { CDK_VERSION } from '../../utils/cdk-shared';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Library;

interface NormalizedSchema extends LambdaSchema {
    projectName: string;
    projectRoot: string;
    projectDirectory: string;
    parsedTags: string[];
}

function normalizeOptions(options: LambdaSchema): NormalizedSchema {
    const name = toFileName(options.name);
    const projectDirectory = options.directory
        ? `${toFileName(options.directory)}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        parsedTags,
    };
}

function addFiles(options: NormalizedSchema): Rule {
    return (host: Tree) =>
        mergeWith(
            apply(url(`./files`), [
                applyTemplates({
                    ...options,
                    ...names(options.name),
                    offsetFromRoot: offsetFromRoot(options.projectRoot),
                }),
                move(options.projectRoot),
                forEach((file) => {
                    // Ignore package.json, while testing it always overwrote the root package.json of project
                    if (
                        host.exists(file.path) &&
                        file.path !== '/package.json'
                    ) {
                        host.overwrite(file.path, file.content);
                        return null;
                    }
                    return file;
                }),
            ])
        );
}

export default function (options: LambdaSchema): Rule {
    const normalizedOptions = normalizeOptions(options);
    return chain([
        addDepsToPackageJson(
            {},
            {
                '@aws-cdk/aws-lambda': CDK_VERSION,
                '@aws-cdk/aws-lambda-nodejs': CDK_VERSION,
            }
        ),
        externalSchematic('@nrwl/workspace', 'lib', { ...options }),
        addFiles(normalizedOptions),
        updateWorkspaceInTree((json) => {
            const packageArchitect = {
                builder: '@nx-plug/aws-cdk:package',
                options: {
                    entryFile: `${normalizedOptions.projectRoot}/src/index.ts`,
                    tsConfig: `${normalizedOptions.projectRoot}/tsconfig.lib.json`,
                    outputPath: `dist/${normalizedOptions.projectRoot}`,
                },
            };

            json.projects[
                normalizedOptions.projectName
            ].architect.package = packageArchitect;

            return json;
        }),
    ]);
}
