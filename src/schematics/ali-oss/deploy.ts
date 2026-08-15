import { BuilderContext } from '@angular-devkit/architect';

import OSS from 'ali-oss';

import { ENV_NAMES } from './config';
import { DeployBuilderSchema } from '../core/types';
import { fixEnvValues, readFiles, uploadFiles } from '../core/utils';

interface AliOSSDeployBuilderSchema extends DeployBuilderSchema {
  region: string;
  ak: string;
  sk: string;
  stsToken: string;
  bucket: string;
  prefix: string;
}
// 30分钟
const TIMEOUT = 1000 * 60 * 30;

function fixConfig(schema: AliOSSDeployBuilderSchema, context: BuilderContext): void {
  fixEnvValues(schema, ENV_NAMES);
  schema.prefix = schema.prefix || '';
  if (schema.prefix.length > 0 && !schema.prefix.endsWith('/')) {
    schema.prefix += '/';
  }
  const logConfog: Record<string, any> = {
    outputPath: schema.outputPath,
    region: schema.region,
    ak: schema.ak,
    sk: schema.sk,
    stsToken: schema.stsToken,
    bucket: schema.bucket,
    prefix: schema.prefix
  };
  context.logger.info(`📦Current configuration:`);
  Object.keys(logConfog).forEach(key => {
    context.logger.info(`    ${key} = ${logConfog[key]}`);
  });
}

async function clear(schema: AliOSSDeployBuilderSchema, context: BuilderContext, client: OSS): Promise<void> {
  context.logger.info(`🤣 Start checking pre-deleted files`);
  const resp = await client.list({ prefix: schema.prefix, 'max-keys': 1000 }, {});
  if (resp.objects == null || resp.objects.length === 0) {
    context.logger.info(`    No need to delete files`);
    return;
  }
  context.logger.info(`    Check that you need to delete ${resp.objects.length} files`);
  const promises: Array<Promise<any>> = [];
  for (const item of resp.objects) {
    promises.push(client.delete(item.name));
  }
  if (promises.length > 0) {
    await Promise.all(promises);
    context.logger.info(`    Successfully deleted`);
  }
}

async function upload(schema: AliOSSDeployBuilderSchema, context: BuilderContext, client: OSS): Promise<void> {
  const list = readFiles({ dirPath: schema.outputPath, stream: true });
  const promises = list.map(item => {
    return () => {
      const key = `${schema.prefix}${item.key}`;
      context.logger.info(`    Uploading "${item.filePath}" => "${key}`);
      return client.put(key, item.stream) as Promise<any>;
    };
  });
  context.logger.info(`😀 Start uploading files`);
  await uploadFiles(schema, promises);
  context.logger.info(`✅ Complete all uploads`);
}

export async function ngDeployAliOSS(schema: AliOSSDeployBuilderSchema, context: BuilderContext): Promise<void> {
  fixConfig(schema, context);

  const client = new OSS({
    region: schema.region,
    accessKeyId: schema.ak,
    accessKeySecret: schema.sk,
    bucket: schema.bucket,
    stsToken: schema.stsToken,
    timeout: TIMEOUT
  });
  if (schema.preClean) {
    await clear(schema, context, client);
  }
  await upload(schema, context, client);

  context.logger.warn(
    `📌注意：阿里云OSS在未绑定域名的情况下直接打开 index.html 会以下载的形式出现，如何设置静态网站托管请参考：https://help.aliyun.com/document_detail/31899.html`
  );
}
