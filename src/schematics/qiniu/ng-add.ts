import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect, list } from '../core/utils';
import { ZONES } from './config';
import { MESSAGES } from '../core/config';

export function ngAddQiniu(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      outputPath: options.outputPath,
      type: options.ngAdd.type,
      ak: await input(`请输入 AccessKey：`),
      sk: await input(`请输入 SecretKey：`),
      zone: await list(`所在机房：`, ZONES),
      bucket: await input(`请输入 Bucket：`),
      prefix: await input(MESSAGES.input_prefix),
      buildCommand: await input(MESSAGES.input_buildCommand),
    };

    addDeployArchitect(tree, options, opt);
  };
}
