import { BuilderContext } from '@angular-devkit/architect';

import * as qiniu from 'qiniu';

import { ENV_NAMES } from './config';
import { DeployBuilderSchema } from '../core/types';
import { fixEnvValues, readFiles, uploadFiles } from '../core/utils';

interface QiniuDeployBuilderSchema extends DeployBuilderSchema {
  ak: string;
  sk: string;
  zone: keyof typeof qiniu.zone;
  bucket: string;
  prefix: string;
}

function fixConfig(schema: QiniuDeployBuilderSchema, context: BuilderContext): void {
  fixEnvValues(schema, ENV_NAMES);
  schema.prefix = schema.prefix || '';
  if (schema.prefix.length > 0 && !schema.prefix.endsWith('/')) {
    schema.prefix += '/';
  }
  const logConfog: Record<string, any> = {
    outputPath: schema.outputPath,
    ak: schema.ak,
    sk: schema.sk,
    zone: `qiniu.zone.${schema.zone}`,
    bucket: schema.bucket,
    prefix: schema.prefix
  };
  context.logger.info(`📦Current configuration:`);
  Object.keys(logConfog).forEach(key => {
    context.logger.info(`    ${key} = ${logConfog[key]}`);
  });
}

async function listPrefix(schema: QiniuDeployBuilderSchema, bucketManager: qiniu.rs.BucketManager): Promise<any> {
  return new Promise((reslove, reject) => {
    bucketManager.listPrefix(schema.bucket, { prefix: schema.prefix, limit: 999999 }, (err, respBody, respInfo) => {
      if (err) {
        reject(err);
        return;
      }
      if (respInfo.statusCode !== 200) {
        reject(respBody);
        return;
      }

      reslove(respBody.items);
    });
  });
}

async function clear(
  schema: QiniuDeployBuilderSchema,
  context: BuilderContext,
  bucketManager: qiniu.rs.BucketManager
): Promise<void> {
  context.logger.info(`🤣 Start checking pre-deleted files`);
  const items = (await listPrefix(schema, bucketManager)) as any[];
  if (items.length === 0) {
    context.logger.info(`    No need to delete files`);
    return;
  }
  context.logger.info(`    Check that you need to delete ${items.length} files`);
  const promises: Array<Promise<void>> = [];
  for (const item of items) {
    const p = new Promise<void>((itemReslove, itemReject) => {
      bucketManager.delete(schema.bucket, item.key, (err, respBody, respInfo) => {
        if (err) {
          itemReject(err);
          return;
        }
        if (respInfo.statusCode !== 200) {
          itemReject(respBody);
          return;
        }

        itemReslove();
      });
    });
    promises.push(p);
  }
  if (promises.length > 0) {
    await Promise.all(promises);
    context.logger.info(`    Successfully deleted`);
  }
}

export async function ngDeployQiniu(schema: QiniuDeployBuilderSchema, context: BuilderContext): Promise<void> {
  fixConfig(schema, context);

  const mac = new qiniu.auth.digest.Mac(schema.ak, schema.sk);
  const config = new qiniu.conf.Config({ zone: qiniu.zone[schema.zone] });
  // 删除文件
  if (schema.preClean) {
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    await clear(schema, context, bucketManager);
  }
  // 上传文件
  const uploadToken = new qiniu.rs.PutPolicy({ scope: schema.bucket }).uploadToken(mac);
  const formUploader = new qiniu.form_up.FormUploader(config);
  const list = readFiles({ dirPath: schema.outputPath });
  const promises = list.map(item => {
    return () => {
      return new Promise((reslove, reject) => {
        const key = `${schema.prefix}${item.key}`;
        const putExtra = new qiniu.form_up.PutExtra();
        formUploader.putFile(uploadToken, key, item.filePath, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode !== 200) {
            reject(respBody);
            return;
          }
          context.logger.info(`    Uploading "${item.filePath}" => "${key}`);
          reslove();
        });
      }) as Promise<void>;
    };
  });

  context.logger.info(`😀 Start uploading files`);
  await uploadFiles(schema, promises);
  context.logger.info(`✅ Complete all uploads`);
  context.logger.warn(
    `📌注意：七牛云默认没有打开【默认首页设置】，不建议打开 Hash URL 路由策略，由于没有相应 API 接口只能手动对 404 页面设置，所有配置请至空间设置进行。`
  );
}
