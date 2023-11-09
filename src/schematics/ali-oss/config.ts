import { EnvName } from '../core/types';

/**
 * https://help.aliyun.com/document_detail/31837.html
 * ```js
 * var a = []; document.querySelectorAll('.tbody tr').forEach(el => a.push({ name: el.querySelector('td:nth-child(1)').textContent, value: el.querySelector('td:nth-child(2)').textContent }));copy(JSON.stringify(a));
 * ```
 */
export const REGIONS = [
  { name: 'Region', value: 'Region ID' },
  { name: '华东1（杭州）', value: 'oss-cn-hangzhou' },
  { name: '华东2（上海）', value: 'oss-cn-shanghai' },
  { name: '华东5（南京-本地地域）', value: 'oss-cn-nanjing' },
  { name: '华东6（福州-本地地域）', value: 'oss-cn-fuzhou' },
  { name: '华中1（武汉-本地地域）', value: 'oss-cn-wuhan' },
  { name: '华北1（青岛）', value: 'oss-cn-qingdao' },
  { name: '华北2（北京）', value: 'oss-cn-beijing' },
  { name: '华北 3（张家口）', value: 'oss-cn-zhangjiakou' },
  { name: '华北5（呼和浩特）', value: 'oss-cn-huhehaote' },
  { name: '华北6（乌兰察布）', value: 'oss-cn-wulanchabu' },
  { name: '华南1（深圳）', value: 'oss-cn-shenzhen' },
  { name: '华南2（河源）', value: 'oss-cn-heyuan' },
  { name: '华南3（广州）', value: 'oss-cn-guangzhou' },
  { name: '西南1（成都）', value: 'oss-cn-chengdu' },
  { name: '中国香港', value: 'oss-cn-hongkong' },
  { name: '美国（硅谷）①', value: 'oss-us-west-1' },
  { name: '美国（弗吉尼亚）①', value: 'oss-us-east-1' },
  { name: '日本（东京）①', value: 'oss-ap-northeast-1' },
  { name: '韩国（首尔）', value: 'oss-ap-northeast-2' },
  { name: '新加坡①', value: 'oss-ap-southeast-1' },
  { name: '澳大利亚（悉尼）①', value: 'oss-ap-southeast-2' },
  { name: '马来西亚（吉隆坡）①', value: 'oss-ap-southeast-3' },
  { name: '印度尼西亚（雅加达）①', value: 'oss-ap-southeast-5' },
  { name: '菲律宾（马尼拉）', value: 'oss-ap-southeast-6' },
  { name: '泰国（曼谷）', value: 'oss-ap-southeast-7' },
  { name: '印度（孟买）①', value: 'oss-ap-south-1' },
  { name: '德国（法兰克福）①', value: 'oss-eu-central-1' },
  { name: '英国（伦敦）', value: 'oss-eu-west-1' },
  { name: '阿联酋（迪拜）①', value: 'oss-me-east-1' },
  { name: '无地域属性（中国内地）', value: 'oss-rg-china-mainland' },
  { name: 'Region', value: 'Region ID' },
  { name: '华东1金融云', value: 'oss-cn-hzjbp' },
  { name: '华东2金融云', value: 'oss-cn-shanghai-finance-1' },
  { name: '华北2 金融云（邀测）', value: 'oss-cn-beijing-finance-1' },
  { name: '华南1金融云', value: 'oss-cn-shenzhen-finance-1' },
  { name: '杭州金融云公网', value: 'oss-cn-hzfinance' },
  { name: '上海金融云公网', value: 'oss-cn-shanghai-finance-1-pub' },
  { name: '深圳金融云公网', value: 'oss-cn-szfinance' },
  { name: '北京金融云公网', value: 'oss-cn-beijing-finance-1-pub' }
];

export const ENV_NAMES: EnvName[] = [
  { key: 'ALIOSS_REGION', name: 'region' },
  { key: 'ALIOSS_AK', name: 'ak' },
  { key: 'ALIOSS_SK', name: 'sk' },
  { key: 'ALIOSS_STSTOKEN', name: 'stsToken' },
  { key: 'ALIOSS_BUCKET', name: 'bucket' },
  { key: 'ALIOSS_PREFIX', name: 'prefix' },
  { key: 'ALIOSS_BUILDCOMMAND', name: 'buildCommand' }
];
