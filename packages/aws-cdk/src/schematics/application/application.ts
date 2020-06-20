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
} from '@nrwl/workspace';
import { ApplicationSchema } from './schema';
import init from '../init/init';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Application;

interface NormalizedSchema extends ApplicationSchema {
    projectName: string;
    projectRoot: string;
    projectDirectory: string;
    parsedTags: string[];
}

function normalizeOptions(options: ApplicationSchema): NormalizedSchema {
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

export default function (options: ApplicationSchema): Rule {
    const normalizedOptions = normalizeOptions(options);
    return chain([
        init(options),
        updateWorkspace((workspace) => {
            const project = workspace.projects
                .add({
                    name: normalizedOptions.projectName,
                    root: normalizedOptions.projectRoot,
                    sourceRoot: `${normalizedOptions.projectRoot}/src`,
                    projectType,
                });

            // Only works on linux
            const optionalArgCmd = (cmd: string, arg: string) => `if [ "{args.${arg}}" = "undefined" ]; then ${cmd}; else ${cmd} {args.${arg}}; fi`;

            project.targets.add({
                name: 'deploy',
                builder: '@nrwl/workspace:run-commands',
                options: {
                    cwd: normalizedOptions.projectRoot,
                    commands: [
                        { command: optionalArgCmd('cdk deploy --require-approval=never', 'stack') },
                    ],
                },
            });

            project.targets.add({
                name: 'destroy',
                builder: '@nrwl/workspace:run-commands',
                options: {
                    cwd: normalizedOptions.projectRoot,
                    commands: [
                        { command: optionalArgCmd('cdk destroy -f', 'stack') },
                    ],
                },
            });
        }),
        addProjectToNxJsonInTree(normalizedOptions.projectName, {
            tags: normalizedOptions.parsedTags,
        }),
        addFiles(normalizedOptions),
        externalSchematic('@nrwl/jest', 'jest-project', {
            project: options.name,
        }),
    ]);
}
