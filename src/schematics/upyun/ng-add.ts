import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect } from '../core/utils';
import { MESSAGES } from '../core/config';

export function ngAddUpyun(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      outputPath: options.outputPath,
      type: options.ngAdd.type,
      name: await input(`请输入服务名称：`),
      operatorName: await input(`请输入操作员名称（确保可写入&可删除权限）：`),
      operatorPwd: await input(`请输入操作员密码：`),
      prefix: await input(MESSAGES.input_prefix),
      buildCommand: await input(MESSAGES.input_buildCommand),
    };

    addDeployArchitect(tree, options, opt);
  };
}
