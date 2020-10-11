import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect, list } from '../core/utils';
import { REGIONS } from './config';

export function ngAddOSS(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      region: await list(`请选择 OSS Region：`, REGIONS),
      ak: await input(`请输入 AccessKeyId：`),
      sk: await input(`请输入 AccessKeySecret：`),
      bucket: await input(`请输入 Bucket：`),
    };

    await addDeployArchitect(tree, options, opt);
  };
}
