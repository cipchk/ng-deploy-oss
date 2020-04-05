import { Rule, Tree } from '@angular-devkit/schematics';
import { PluginOptions } from '../core/types';
import { input, addDeployArchitect, list } from '../core/utils';
import { ZONES } from './config';

export function ngAddQiniu(options: PluginOptions): Rule {
  return async (tree: Tree) => {
    const opt = {
      outputPath: options.outputPath,
      type: options.ngAdd.type,
      ak: await input(`请输入 AccessKey：`),
      sk: await input(`请输入 SecretKey：`),
      zone: await list(`所在机房支持：`, ZONES),
      bucket: await input(`请输入 Bucket：`),
      prefix: await input(`请输入路径前缀，如果不指定表示放在根目录下：`),
      buildCommand: await input(`请输入构建生产环境的 NPM 命令行（例如：npm run build），若为空表示自动根据 angular.json 构建生成环境`),
    };

    addDeployArchitect(tree, options, opt);
  };
}
