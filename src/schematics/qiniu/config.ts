import { EnvName } from '../core/types';

/**
 * https://developer.qiniu.com/kodo/1671/region-endpoint-fq
 * ```js
 * var list = []; document.querySelectorAll('table tbody tr').forEach(el => {
    const regionID = el.querySelector('td:nth-child(2)').innerText.trim().replace(/-/g, '_');
    list.push(`{ name: 'qiniu.zone.Zone_${regionID} - ${el.querySelector('td:nth-child(1)').innerText.trim()}', value: 'Zone_${regionID}' }`);
});console.log(list.join('\n'));
  ```
 */
export const ZONES = [
  { name: 'qiniu.zone.Zone_z0 - 华东-浙江', value: 'Zone_z0' },
  { name: 'qiniu.zone.Zone_cn_east_2 - 华东-浙江2', value: 'Zone_cn_east_2' },
  { name: 'qiniu.zone.Zone_z1 - 华北-河北', value: 'Zone_z1' },
  { name: 'qiniu.zone.Zone_z2 - 华南-广东', value: 'Zone_z2' },
  { name: 'qiniu.zone.Zone_cn_northwest_1 - 西北-陕西1', value: 'Zone_cn_northwest_1' },
  { name: 'qiniu.zone.Zone_na0 - 北美-洛杉矶', value: 'Zone_na0' },
  { name: 'qiniu.zone.Zone_as0 - 亚太-新加坡（原东南亚）', value: 'Zone_as0' },
  { name: 'qiniu.zone.Zone_ap_southeast_2 - 亚太-河内', value: 'Zone_ap_southeast_2' },
  { name: 'qiniu.zone.Zone_ap_southeast_3 - 亚太-胡志明', value: 'Zone_ap_southeast_3' }
];

export const ENV_NAMES: EnvName[] = [
  { key: 'QINIU_AK', name: 'ak' },
  { key: 'QINIU_SK', name: 'sk' },
  { key: 'QINIU_ZONE', name: 'zone' },
  { key: 'QINIU_BUCKET', name: 'bucket' },
  { key: 'QINIU_PREFIX', name: 'prefix' },
  { key: 'QINIU_BUILDCOMMAND', name: 'buildCommand' }
];
