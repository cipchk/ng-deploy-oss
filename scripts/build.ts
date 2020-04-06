import { spawn } from 'child_process';
import { copy, copySync, writeFile, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
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
  return writeFile(path, JSON.stringify(pkg, null, 2));
}

async function compileSchematics() {
  const tsc = ['tsc', '-p', 'tsconfig.json'];
  await spawnPromise(`npx`, tsc);
  return Promise.all([
    copy(src('builders.json'), dest('builders.json')),
    copy(src('collection.json'), dest('collection.json')),
    copy(src('schematics', 'schema.json'), dest('schematics', 'schema.json')),
    copy(src('schematics', 'deploy', 'schema.json'), dest('schematics', 'deploy', 'schema.json')),
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
  ['package.json', 'README.md', 'CHANGELOG.md'].forEach(fileName => {
    copySync(join(process.cwd(), fileName), dest(fileName));
  });
  await Promise.all([compileSchematics(), await fixPackage()]);
}

Promise.all([buildLibrary()])
  .then(async () => {
    if (!TEST) {
      return Promise.resolve();
    }
    console.log(`Test mode.`);
    const testProjectPath = join(process.cwd(), '../ng9/node_modules/ng-deploy-oss');
    if (existsSync(testProjectPath)) {
      rimraf.sync(testProjectPath);
    }
    await replaceVersionNumber();
    return copy(destPath, testProjectPath);
  })
  .then(() => {
    const execSync = require('child_process').execSync;
    const command = `npm publish dist --access public --ignore-scripts`;
    if (RELEASE) {
      execSync(command);
    }
    if (RELEASE_NEXT) {
      execSync(`${command} --tag next`);
    }

    console.log('Success');
  });
