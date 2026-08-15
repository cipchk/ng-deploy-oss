import { BuilderContext } from '@angular-devkit/architect';

import upyun from 'upyun';

import { ENV_NAMES } from './config';
import { DeployBuilderSchema } from '../core/types';
import { fixEnvValues, readFiles, uploadFiles } from '../core/utils';

interface UpyunDeployBuilderSchema extends DeployBuilderSchema {
  name: string;
  operatorName: string;
  operatorPwd: string;
  prefix: string;
}

function fixConfig(schema: UpyunDeployBuilderSchema, context: BuilderContext): void {
  fixEnvValues(schema, ENV_NAMES);
  schema.prefix = schema.prefix || '/';
  if (!schema.prefix.endsWith('/')) {
    schema.prefix += '/';
  }
  const logConfog: Record<string, any> = {
    outputPath: schema.outputPath,
    name: schema.name,
    operatorName: schema.operatorName,
    operatorPwd: schema.operatorPwd,
    prefix: schema.prefix
  };
  context.logger.info(`📦Current configuration:`);
  Object.keys(logConfog).forEach(key => {
    context.logger.info(`    ${key} = ${logConfog[key]}`);
  });
}

async function clear(schema: UpyunDeployBuilderSchema, context: BuilderContext, client: any): Promise<void> {
  context.logger.info(`🤣 Start checking pre-deleted files`);
  const listResp = await client.listDir(schema.prefix, { limit: 10000 });
  if (listResp === false) {
    context.logger.info(`    No need to delete files`);
    return;
  }
  context.logger.info(`    Check that you need to delete ${listResp.files.length} files`);
  const promises: Array<Promise<any>> = [];
  for (const item of listResp.files as Array<{ name: string; size: 'N' | 'F' }>) {
    promises.push(client.deleteFile(item.name));
  }
  if (promises.length > 0) {
    await Promise.all(promises);
    context.logger.info(`    Successfully deleted`);
  }
}

async function upload(schema: UpyunDeployBuilderSchema, context: BuilderContext, client: any): Promise<void> {
  const list = readFiles({ dirPath: schema.outputPath, stream: true });
  const promises = list.map(item => {
    return () => {
      const key = `${schema.prefix}${item.key}`;
      context.logger.info(`    Uploading "${item.filePath}" => "${key}`);
      return client.putFile(key, item.stream) as Promise<any>;
    };
  });
  context.logger.info(`😀 Start uploading files`);
  await uploadFiles(schema, promises);
  context.logger.info(`✅ Complete all uploads`);
}

export async function ngDeployUpyun(schema: UpyunDeployBuilderSchema, context: BuilderContext): Promise<void> {
  fixConfig(schema, context);

  const service = new upyun.Service(schema.name, schema.operatorName, schema.operatorPwd);
  const client = new upyun.Client(service);
  // 删除文件
  if (schema.preClean) {
    await clear(schema, context, client);
  }
  // 上传文件
  await upload(schema, context, client);
}
