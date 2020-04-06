import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect, list } from '../core/utils';
import { MESSAGES } from '../core/config';
import { REGIONS } from './config';

export function ngAddOSS(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      outputPath: options.outputPath,
      type: options.ngAdd.type,
      region: await list(`请选择 OSS Region：`, REGIONS),
      ak: await input(`请输入 AccessKeyId：`),
      sk: await input(`请输入 AccessKeySecret：`),
      bucket: await input(`请输入 Bucket：`),
      prefix: await input(MESSAGES.input_prefix),
      buildCommand: await input(MESSAGES.input_buildCommand),
    };

    addDeployArchitect(tree, options, opt);
  };
}
