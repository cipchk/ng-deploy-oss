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
  noBuild: boolean;
  configuration: 'production';
  buildCommand: string;
  outputPath: string;
  baseHref: string;
  '--'?: string[];
}

export interface EnvName {
  key: string;
  name: string;
}
