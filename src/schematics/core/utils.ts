import { Tree, SchematicsException } from '@angular-devkit/schematics';
// import { addPackageJsonDependency, NodeDependencyType } from 'schematics-utilities';
import { readdirSync, statSync, createReadStream, ReadStream } from 'fs-extra';
import { join } from 'path';
import { PluginOptions, EnvName, DeployBuilderSchema } from './types';
import { MESSAGES } from './config';
import { loadEsmModule } from './load-esm';
import { parse } from 'jsonc-parser';

export function getPath(tree: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(file => tree.exists(file))[0];
  return path;
}

export function getWorkspace(tree: Tree): any {
  const configBuffer = tree.read(getPath(tree));
  if (configBuffer === null) {
    throw new SchematicsException('Could not find angular.json');
  }

  return parse(configBuffer.toString());
}

export function getProject(tree: Tree, projectName: string) {
  const workspace = getWorkspace(tree);
  const projectNames = Object.keys(workspace.projects);
  const name = projectName! || (projectNames.length > 0 ? projectNames[0] : null);
  if (!name) {
    throw new SchematicsException('No Angular project selected and no default project in the workspace');
  }
  // Validating project name
  const project = workspace.projects[name];
  if (!project) {
    throw new SchematicsException('The specified Angular project is not defined in this workspace');
  }

  // Checking if it is application
  if (project.projectType !== 'application') {
    throw new SchematicsException(`Deploy requires an Angular project type of "application" in angular.json`);
  }

  // Getting output path from Angular.json
  if (
    !project.architect ||
    !project.architect.build ||
    !project.architect.build.options ||
    !project.architect.build.options.outputPath
  ) {
    throw new SchematicsException(
      `Cannot read the output path(architect.build.options.outputPath) of the Angular project "${projectName}" in angular.json`
    );
  }
  return { name, workspace, outputPath: project.architect.build.options.outputPath };
}

export async function addDeployArchitect(tree: Tree, options: PluginOptions, deployOptions: { [key: string]: any }) {
  deployOptions = {
    outputPath: options.outputPath,
    type: options.ngAdd.type,
    ...deployOptions,
    prefix: await input(MESSAGES.input_prefix),
    buildCommand: await input(MESSAGES.input_buildCommand),
    preClean: await confirm(MESSAGES.input_preDeletedFiles, true),
    oneByOneUpload: await confirm(MESSAGES.input_oneByOneUpload, false)
  };
  Object.keys(deployOptions)
    .filter(key => deployOptions[key] == null || deployOptions[key] === '')
    .forEach(key => delete deployOptions[key]);
  const project = options.workspaceSchema.projects[options.projectName];
  project.architect!['deploy'] = {
    builder: 'ng-deploy-oss:deploy',
    options: deployOptions
  };

  const workspacePath = getPath(tree);
  tree.overwrite(workspacePath, JSON.stringify(options.workspaceSchema, null, 2));

  // addPackageJsonDependency(tree, { type: NodeDependencyType.Dev, version: 'VERSIONPLACEHOLDER', name: 'ng-deploy-oss' });
}

export function fixAdditionalProperties(options: { [key: string]: any }) {
  if (!Array.isArray(options['--'])) return;
  options['--']
    .filter(w => w.startsWith('--'))
    .forEach(optStr => {
      const arr = optStr.substr(2).split('=');
      options[arr[0]] = arr[1];
    });
}

export function fixEnvValues(options: { [key: string]: any }, envData: EnvName[]) {
  for (const envItem of envData) {
    const envValue = process.env[envItem.key];
    if (envValue != null) {
      options[envItem.name] = envValue;
    }
  }
}

export function readFiles(options: {
  dirPath: string;
  stream?: boolean;
}): Array<{ filePath: string; stream: ReadStream | null; key: string }> {
  const startLen = options.dirPath.length + 1;
  const fileList: string[] = [];
  const fn = (p: string) => {
    readdirSync(p).forEach(filePath => {
      const fullPath = join(p, filePath);
      if (statSync(fullPath).isDirectory()) {
        fn(fullPath);
        return;
      }
      fileList.push(fullPath);
    });
  };
  fn(options.dirPath);

  // 将所有 `.html` 放置最后上传
  // https://github.com/cipchk/ng-deploy-oss/issues/13
  fileList.sort(a => (a.endsWith('.html') ? 1 : -1));
  return fileList.map(fullPath => ({
    filePath: fullPath,
    stream: options.stream === true ? createReadStream(fullPath) : null,
    // 修复 window 下的分隔符会引起 %5C
    key: fullPath.substr(startLen).replace(/\\/g, '/')
  }));
}

export async function uploadFiles(schema: DeployBuilderSchema, promises: Array<() => Promise<void>>): Promise<any> {
  if (!schema.oneByOneUpload) {
    return Promise.all(promises.map(fn => fn()));
  }
  for (const item of promises) {
    await item();
  }
}

export function normalizePath(...args: string[]): string {
  if (args.length <= 1) return args.join('');
  return args
    .map((val, idx) => {
      if (idx <= 0) return val;
      if (val.startsWith('/')) return val.substr(1);
      return val;
    })
    .join('/');
}

export async function input(message: string): Promise<string> {
  const { default: inquirer } = await loadEsmModule<typeof import('inquirer')>('inquirer');
  const { ok } = await inquirer.prompt<{ ok: any }>([
    {
      type: 'input',
      name: 'ok',
      message
    }
  ]);
  return ok;
}

export async function list(message: string, choices: Array<{ name: string; value: any }>): Promise<string> {
  const { default: inquirer } = await loadEsmModule<typeof import('inquirer')>('inquirer');
  const { ok } = await inquirer.prompt<{ ok: any }>([
    {
      type: 'list',
      name: 'ok',
      message,
      choices
    }
  ]);
  return ok;
}

export async function confirm(message: string, confirmByDefault: boolean = false): Promise<boolean> {
  const { default: inquirer } = await loadEsmModule<typeof import('inquirer')>('inquirer');
  const { ok } = await inquirer.prompt<{ ok: any }>([
    {
      type: 'confirm',
      name: 'ok',
      default: confirmByDefault,
      message
    }
  ]);
  return ok;
}
