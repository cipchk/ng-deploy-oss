import { EnvName } from '../core/types';

/**
 * https://developer.qiniu.com/kodo/1671/region-endpoint-fq
 * ```js
 * var a = []; document.querySelectorAll('[data-v-md-line="16"] tbody tr').forEach(el => a.push({ name: 'qiniu.zone.Zone_' + el.querySelector('td:nth-child(2)').textContent + ' - ' + el.querySelector('td:nth-child(1)').textContent, value: 'Zone_' + el.querySelector('td:nth-child(2)').textContent }));console.log(JSON.stringify(a));
 * ```
 */
export const ZONES = [
  { name: 'qiniu.zone.Zone_z0 - 华东-浙江', value: 'Zone_z0' },
  { name: 'qiniu.zone.Zone_cn-east-2 - 华东-浙江2', value: 'Zone_cn-east-2' },
  { name: 'qiniu.zone.Zone_z1 - 华北-河北', value: 'Zone_z1' },
  { name: 'qiniu.zone.Zone_z2 - 华南-广东', value: 'Zone_z2' },
  { name: 'qiniu.zone.Zone_na0 - 北美-洛杉矶', value: 'Zone_na0' },
  { name: 'qiniu.zone.Zone_as0 - 亚太-新加坡（原东南亚）', value: 'Zone_as0' },
  { name: 'qiniu.zone.Zone_ap-northeast-1 - 亚太-首尔', value: 'Zone_ap-northeast-1' },
];

export const ENV_NAMES: EnvName[] = [
  { key: 'QINIU_AK', name: 'ak' },
  { key: 'QINIU_SK', name: 'sk' },
  { key: 'QINIU_ZONE', name: 'zone' },
  { key: 'QINIU_BUCKET', name: 'bucket' },
  { key: 'QINIU_PREFIX', name: 'prefix' },
  { key: 'QINIU_BUILDCOMMAND', name: 'buildCommand' },
];
