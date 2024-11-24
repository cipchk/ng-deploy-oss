import { spawn } from 'child_process';
import { copy, copySync, writeFile, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';

import * as rimraf from 'rimraf';

const TEST = process.argv.includes('--test');
const RELEASE = process.argv.includes('--release');
const RELEASE_NEXT = process.argv.includes('--release-next');
const src = (...args: string[]) => join(process.cwd(), 'src', ...args);
const dest = (...args: string[]) => join(process.cwd(), 'dist', ...args);
const destPath = dest('');

function spawnPromise(command: string, args: string[]) {
  return new Promise(resolve => spawn(command, args, { stdio: 'inherit' }).on('close', resolve));
}

async function fixPackage() {
  const path = dest('package.json');
  const pkg = await import(path);
  ['scripts', 'devDependencies', 'jest', 'husky'].forEach(key => delete pkg[key]);
  // pkg.dependencies['@angular-devkit/architect'] = `^0.1100.0 || ^0.1200.0 || ^0.1300.0`;
  // ['@angular-devkit/core', '@angular-devkit/schematics'].forEach(name => {
  //   pkg.dependencies[name] = `^11.0.0 || ^12.0.0 || ^13.0.0`;
  // });
  const rootPackage = await import(dest('../package.json'));
  ['@angular-devkit/architect', '@angular-devkit/core', '@angular-devkit/schematics'].forEach(key => {
    pkg.dependencies[key] = rootPackage.dependencies[key];
  });
  return writeFile(path, JSON.stringify(pkg, null, 2));
}

async function compileSchematics() {
  const tsc = ['tsc', '-p', 'tsconfig.json'];
  await spawnPromise(`npx`, tsc);
  return Promise.all([
    copy(src('builders.json'), dest('builders.json')),
    copy(src('collection.json'), dest('collection.json')),
    copy(src('schematics', 'schema.json'), dest('schematics', 'schema.json')),
    copy(src('schematics', 'deploy', 'schema.json'), dest('schematics', 'deploy', 'schema.json'))
  ]);
}

async function replaceVersionNumber() {
  const pkg = await import(join(process.cwd(), 'package.json'));
  const utilsPath = dest('schematics', 'core', 'utils.js');
  const content = readFileSync(utilsPath, { encoding: 'utf8' }).replace(`VERSIONPLACEHOLDER`, `~${pkg.version}`);
  writeFileSync(utilsPath, content);
}

async function buildLibrary() {
  if (existsSync(destPath)) {
    rimraf.sync(destPath);
  }
  ['package.json', 'README.md'].forEach(fileName => {
    copySync(join(process.cwd(), fileName), dest(fileName));
  });
  await Promise.all([compileSchematics(), await fixPackage()]);
}

Promise.all([buildLibrary()])
  .then(async () => {
    await replaceVersionNumber();
    if (!TEST) {
      return Promise.resolve();
    }
    const projectName = `ng17`;
    console.info(`Test mode. Copy to [${projectName}] project`);
    const testProjectPath = join(process.cwd(), `../${projectName}/node_modules/ng-deploy-oss`);
    if (existsSync(testProjectPath)) {
      rimraf.sync(testProjectPath);
    }
    return copy(destPath, testProjectPath);
  })
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = `cd dist & npm publish --access public --ignore-scripts`;
    if (RELEASE) {
      console.log('Release Mode');
      execSync(command);
    }
    if (RELEASE_NEXT) {
      console.log('Release Next Mode');
      execSync(`${command} --tag next`);
    }

    console.log('Success');
  });
