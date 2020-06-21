import {
    apply,
    applyTemplates,
    chain,
    mergeWith,
    move,
    Rule,
    url,
    externalSchematic,
} from '@angular-devkit/schematics';
import {
    addProjectToNxJsonInTree,
    names,
    offsetFromRoot,
    projectRootDir,
    ProjectType,
    toFileName,
    updateWorkspace,
    addPackageWithInit,
} from '@nrwl/workspace';
import { AwsLambdaSchematicSchema } from './schema';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Application;

interface NormalizedSchema extends AwsLambdaSchematicSchema {
    projectName: string;
    projectRoot: string;
    projectDirectory: string;
    parsedTags: string[];
}

function normalizeOptions(options: AwsLambdaSchematicSchema): NormalizedSchema {
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
    return mergeWith(
        apply(url(`./files`), [
            applyTemplates({
                ...options,
                ...names(options.name),
                offsetFromRoot: offsetFromRoot(options.projectRoot),
            }),
            move(options.projectRoot),
        ])
    );
}

export default function (options: AwsLambdaSchematicSchema): Rule {
    const normalizedOptions = normalizeOptions(options);
    return chain([
        // addPackageWithInit('@nrwl/jest'),
        updateWorkspace((workspace) => {
            workspace.projects
                .add({
                    name: normalizedOptions.projectName,
                    root: normalizedOptions.projectRoot,
                    sourceRoot: `${normalizedOptions.projectRoot}`,
                    projectType,
                });
        }),
        addProjectToNxJsonInTree(normalizedOptions.projectName, {
            tags: normalizedOptions.parsedTags,
        }),
        addFiles(normalizedOptions),
        // Throws error on creating application
        // Cannot read property 'test' of undefined
        //
        // externalSchematic('@nrwl/jest', 'jest-project', {
        //     project: options.name,
        // }),
    ]);
}
