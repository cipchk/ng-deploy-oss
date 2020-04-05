import { EnvName } from '../core/types';

export const ZONES = [
  { value: 'Zone_z0', name: 'qiniu.zone.Zone_z0 - 华东' },
  { value: 'Zone_z1', name: 'qiniu.zone.Zone_z1 - 华北' },
  { value: 'Zone_z2', name: 'qiniu.zone.Zone_z2 - 华南' },
  { value: 'Zone_na0', name: 'qiniu.zone.Zone_na0 - 北美' },
  { value: 'Zone_as0', name: 'qiniu.zone.Zone_as0' },
];

export const ENV_NAMES: EnvName[] = [
  { key: 'QINIU_AK', name: 'ak' },
  { key: 'QINIU_SK', name: 'sk' },
  { key: 'QINIU_ZONE', name: 'zone' },
  { key: 'QINIU_BUCKET', name: 'bucket' },
  { key: 'QINIU_KEY', name: 'key' },
  { key: 'QINIU_PREFIX', name: 'prefix' },
];
