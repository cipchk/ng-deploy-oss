import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect, list } from '../core/utils';
import { ZONES } from './config';

export function ngAddQiniu(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      ak: await input(`请输入 AccessKey：`),
      sk: await input(`请输入 SecretKey：`),
      zone: await list(`所在机房：`, ZONES),
      bucket: await input(`请输入 Bucket：`),
    };

    await addDeployArchitect(tree, options, opt);
  };
}
