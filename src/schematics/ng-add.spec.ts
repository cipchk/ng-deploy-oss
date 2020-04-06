import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Tree } from '@angular-devkit/schematics';

const collectionPath = require.resolve('../collection.json');
const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'tests',
  version: '8.0.0',
};
const appOptions: ApplicationOptions = { name: 'test-app' };

describe('ng add ng-deploy-oss', () => {
  let tree: UnitTestTree;
  const testRunner = new SchematicTestRunner('schematics', collectionPath);

  beforeEach(async () => {
    const appTree = await testRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
    tree = await testRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise();
  });

  describe('ng add', () => {
    it('should be working', async () => {
      tree = await testRunner.runSchematicAsync('ng-add', {}, tree).toPromise();

      const angularJson = JSON.parse(tree.readContent('/angular.json'));
      const deploy = angularJson.projects[appOptions.name].architect.deploy;
      expect(deploy).toBeDefined();
      expect(deploy.builder).toBe(`ng-deploy-oss:deploy`);
    });

    ['ali-oss', 'upyun'].forEach(type => {
      it(`should be ${type} via type`, async () => {
        tree = await testRunner.runSchematicAsync('ng-add', { type }, tree).toPromise();

        const angularJson = JSON.parse(tree.readContent('/angular.json'));
        const deploy = angularJson.projects[appOptions.name].architect.deploy;
        expect(deploy).toBeDefined();
        expect(deploy.options.type).toBe(type);
      });
    });

    it('should be throw error when is invalid type', async () => {
      await expect(testRunner.runSchematicAsync('ng-add', { type: 'INVALIDTYPE' }, Tree.empty()).toPromise()).rejects.toThrow();
    });
  });
});
