import { experimental } from '@angular-devkit/core';

export type NgAddType = 'qiniu' | 'upyun' | 'ali-oss';

export interface NgAddOptions {
  project: string;
  type: NgAddType;
}

export interface PluginOptions {
  ngAdd: NgAddOptions;
  projectName: string;
  workspaceSchema: experimental.workspace.WorkspaceSchema;
  outputPath: string;
}

export interface DeployBuilderSchema {
  type: NgAddType;
  outputPath: string;
  configuration: 'production';
  noBuild: boolean;
  buildCommand: string;
  baseHref: string;
  /** 是否预清除所有远程目录下的文件 */
  preClean: boolean;
  '--'?: string[];
}

export interface EnvName {
  key: string;
  name: string;
}
