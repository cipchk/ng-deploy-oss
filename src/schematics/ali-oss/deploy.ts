import { BuilderContext } from '@angular-devkit/architect';
import * as OSS from 'ali-oss';
import { ENV_NAMES } from './config';
import { DeployBuilderSchema } from '../core/types';
import { fixEnvValues, readFiles } from '../core/utils';

interface AliOSSDeployBuilderSchema extends DeployBuilderSchema {
  region: string;
  ak: string;
  sk: string;
  stsToken: string;
  bucket: string;
  prefix: string;
}
const TIMEOUT = 1000 * 10;

function fixConfig(schema: AliOSSDeployBuilderSchema, context: BuilderContext) {
  fixEnvValues(schema, ENV_NAMES);
  schema.prefix = schema.prefix || '';
  if (schema.prefix.length > 0 && !schema.prefix.endsWith('/')) {
    schema.prefix += '/';
  }
  const logConfog: { [key: string]: any } = {
    outputPath: schema.outputPath,
    region: schema.region,
    ak: schema.ak,
    sk: schema.sk,
    stsToken: schema.stsToken,
    bucket: schema.bucket,
    prefix: schema.prefix,
  };
  context.logger.info(`📦Current configuration:`);
  Object.keys(logConfog).forEach(key => {
    context.logger.info(`    ${key} = ${logConfog[key]}`);
  });
}

async function clear(schema: AliOSSDeployBuilderSchema, context: BuilderContext, client: OSS) {
  return new Promise(async reslove => {
    context.logger.info(`🤣 Start checking pre-deleted files`);
    const items = await client.list({ prefix: schema.prefix, 'max-keys': 1000 }, {});
    if (items.objects.length === 0) {
      context.logger.info(`    No need to delete files`);
      reslove();
      return;
    }
    context.logger.info(`    Check that you need to delete ${items.objects.length} files`);
    const promises: Array<Promise<any>> = [];
    for (const item of items.objects) {
      promises.push(client.delete(item.name));
    }
    if (promises.length > 0) {
      await Promise.all(promises);
      context.logger.info(`    Successfully deleted`);
    }
    reslove();
  });
}

async function upload(schema: AliOSSDeployBuilderSchema, context: BuilderContext, client: OSS) {
  const promises: Array<Promise<any>> = [];
  readFiles({
    dirPath: schema.outputPath,
    cb: ({ filePath, stream, key }) => {
      key = `${schema.prefix}${key}`;
      context.logger.info(`    Uploading "${filePath}" => "${key}`);
      const p = client.put(key, stream);
      promises.push(p);
    },
    stream: true,
  });
  context.logger.info(`😀 Start uploading files`);
  await Promise.all(promises);
  context.logger.info(`✅ Complete all uploads`);
}

export async function ngDeployAliOSS(schema: AliOSSDeployBuilderSchema, context: BuilderContext) {
  fixConfig(schema, context);

  const client = new OSS({
    region: schema.region,
    accessKeyId: schema.ak,
    accessKeySecret: schema.sk,
    bucket: schema.bucket,
    stsToken: schema.stsToken,
    timeout: TIMEOUT,
  });
  await clear(schema, context, client);
  await upload(schema, context, client);
}
