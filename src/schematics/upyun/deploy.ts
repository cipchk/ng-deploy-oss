import { BuilderContext } from '@angular-devkit/architect';
const upyun = require('upyun');
import { ENV_NAMES } from './config';
import { DeployBuilderSchema } from '../core/types';
import { fixEnvValues, readFiles } from '../core/utils';

interface UpyunDeployBuilderSchema extends DeployBuilderSchema {
  name: string;
  operatorName: string;
  operatorPwd: string;
  prefix: string;
}

function fixConfig(schema: UpyunDeployBuilderSchema, context: BuilderContext) {
  fixEnvValues(schema, ENV_NAMES);
  schema.prefix = schema.prefix || '/';
  if (!schema.prefix.endsWith('/')) {
    schema.prefix += '/';
  }
  const logConfog: { [key: string]: any } = {
    outputPath: schema.outputPath,
    name: schema.name,
    operatorName: schema.operatorName,
    operatorPwd: schema.operatorPwd,
    prefix: schema.prefix,
  };
  context.logger.info(`📦Current configuration:`);
  Object.keys(logConfog).forEach(key => {
    context.logger.info(`    ${key} = ${logConfog[key]}`);
  });
}

async function clear(schema: UpyunDeployBuilderSchema, context: BuilderContext, client: any) {
  return new Promise(async reslove => {
    context.logger.info(`🤣 Start checking pre-deleted files`);
    const listResp = await client.listDir(schema.prefix, { limit: 10000 });
    if (listResp === false) {
      context.logger.info(`    No need to delete files`);
      reslove();
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
    reslove();
  });
}

async function upload(schema: UpyunDeployBuilderSchema, context: BuilderContext, client: any) {
  const promises: Array<Promise<any>> = [];
  readFiles({
    dirPath: schema.outputPath,
    cb: ({ filePath, stream, key }) => {
      key = `${schema.prefix}${key}`;
      context.logger.info(`    Uploading "${filePath}" => "${key}`);
      const p = client.putFile(key, stream);
      promises.push(p);
    },
    stream: true,
  });
  context.logger.info(`😀 Start uploading files`);
  await Promise.all(promises);
  context.logger.info(`✅ Complete all uploads`);
}

export async function ngDeployUpyun(schema: UpyunDeployBuilderSchema, context: BuilderContext) {
  fixConfig(schema, context);

  const service = new upyun.Service(schema.name, schema.operatorName, schema.operatorPwd);
  const client = new upyun.Client(service);
  // 删除文件
  await clear(schema, context, client);
  // 上传文件
  await upload(schema, context, client);
}