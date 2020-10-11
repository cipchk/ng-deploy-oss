import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect } from '../core/utils';

export function ngAddUpyun(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      name: await input(`请输入服务名称：`),
      operatorName: await input(`请输入操作员名称（确保可写入&可删除权限）：`),
      operatorPwd: await input(`请输入操作员密码：`),
    };

    await addDeployArchitect(tree, options, opt);
  };
}
