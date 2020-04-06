import { chain, Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { NgAddOptions, PluginOptions } from './core/types';
import { getProject } from './core/utils';
import { ngAddQiniu } from './qiniu/ng-add';
import { ngAddUpyun } from './upyun/ng-add';
import { ngAddOSS } from './ali-oss/ng-add';

export const ngAdd = (options: NgAddOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProject(tree, options.project);
    const opt: PluginOptions = {
      ngAdd: options,
      projectName: project.name,
      workspaceSchema: project.workspace,
      outputPath: project.outputPath,
    };

    const rules: Rule[] = [];
    switch (options.type) {
      case 'qiniu':
        rules.push(ngAddQiniu(opt));
        break;
      case 'upyun':
        rules.push(ngAddUpyun(opt));
        break;
      case 'ali-oss':
        rules.push(ngAddOSS(opt));
        break;
      default:
        throw new SchematicsException(`Invalid cloud type "${options.type}"`);
    }
    return chain(rules)(tree, context);
  };
};
