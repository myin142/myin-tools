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
  addDepsToPackageJson,
  readJsonInTree,
  updateJsonInTree,
} from '@nrwl/workspace';
import { LambdaSchema } from './schema';
import { CDK_VERSION } from '../../utils/cdk-shared';
import { libsDir } from '@nrwl/workspace/src/utils/ast-utils';

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

function updateTsConfig(options: NormalizedSchema): Rule {
  return chain([
    (host: Tree) => {
      const nxJson = readJsonInTree(host, 'nx.json');
      return updateJsonInTree('tsconfig.json', (json) => {
        const c = json.compilerOptions;
        c.paths = c.paths || {};
        delete c.paths[options.name];
        c.paths[`@${nxJson.npmScope}/${options.projectDirectory}`] = [
          `${libsDir(host)}/${options.projectDirectory}/src/app.ts`,
        ];
        return json;
      });
    },
  ]);
}

export default function (options: LambdaSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    addPackageWithInit('@nrwl/jest'),
    addDepsToPackageJson(
      {},
      {
        '@aws-cdk/aws-lambda': CDK_VERSION,
        '@aws-cdk/aws-lambda-nodejs': CDK_VERSION,
      }
    ),
    updateWorkspace((workspace) => {
      workspace.projects.add({
        name: normalizedOptions.projectName,
        root: normalizedOptions.projectRoot,
        sourceRoot: `${normalizedOptions.projectRoot}`,
        projectType,
        // project has to architect on default, so it will throw exception if not set
        architect: {},
      });
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
    updateTsConfig(normalizedOptions),
    externalSchematic('@nrwl/jest', 'jest-project', {
      // Use normalized option name, when using --directory name will be slightly different
      project: normalizedOptions.projectName,
      skipSerializers: true,
    }),
  ]);
}
