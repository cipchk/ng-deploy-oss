import { EnvName } from '../core/types';

/**
 * https://help.aliyun.com/document_detail/31837.html
 * ```js
 * var a = []; document.querySelectorAll('.tbody tr').forEach(el => a.push({ name: el.querySelector('td:nth-child(1)').textContent.trim(), value: el.querySelector('td:nth-child(3)').textContent.trim() }));copy(JSON.stringify(a.filter(w=>w.name != '地域')));
 * ```
 */
export const REGIONS = [
  { name: '华东1（杭州）', value: 'oss-cn-hangzhou' },
  { name: '华东2（上海）', value: 'oss-cn-shanghai' },
  { name: '华东5（南京-本地地域）', value: 'oss-cn-nanjing' },
  { name: '华东6（福州-本地地域）', value: 'oss-cn-fuzhou' },
  { name: '华中1（武汉-本地地域）', value: 'oss-cn-wuhan-lr' },
  { name: '华北1（青岛）', value: 'oss-cn-qingdao' },
  { name: '华北2（北京）', value: 'oss-cn-beijing' },
  { name: '华北3（张家口）', value: 'oss-cn-zhangjiakou' },
  { name: '华北5（呼和浩特）', value: 'oss-cn-huhehaote' },
  { name: '华北6（乌兰察布）', value: 'oss-cn-wulanchabu' },
  { name: '华南1（深圳）', value: 'oss-cn-shenzhen' },
  { name: '华南2（河源）', value: 'oss-cn-heyuan' },
  { name: '华南3（广州）', value: 'oss-cn-guangzhou' },
  { name: '西南1（成都）', value: 'oss-cn-chengdu' },
  { name: '中国香港', value: 'oss-cn-hongkong' },
  { name: '日本（东京）', value: 'oss-ap-northeast-1' },
  { name: '韩国（首尔）', value: 'oss-ap-northeast-2' },
  { name: '新加坡', value: 'oss-ap-southeast-1' },
  { name: '马来西亚（吉隆坡）', value: 'oss-ap-southeast-3' },
  { name: '印度尼西亚（雅加达）', value: 'oss-ap-southeast-5' },
  { name: '菲律宾（马尼拉）', value: 'oss-ap-southeast-6' },
  { name: '泰国（曼谷）', value: 'oss-ap-southeast-7' },
  { name: '德国（法兰克福）', value: 'oss-eu-central-1' },
  { name: '英国（伦敦）', value: 'oss-eu-west-1' },
  { name: '美国（硅谷）', value: 'oss-us-west-1' },
  { name: '美国（弗吉尼亚）', value: 'oss-us-east-1' },
  { name: '阿联酋（迪拜）', value: 'oss-me-east-1' },
  { name: '华东1 金融云', value: 'oss-cn-hzjbp' },
  { name: '华东2 金融云', value: 'oss-cn-shanghai-finance-1' },
  { name: '华南1 金融云', value: 'oss-cn-shenzhen-finance-1' },
  { name: '华北2 金融云（邀测）', value: 'oss-cn-beijing-finance-1' },
  { name: '杭州金融云公网', value: 'oss-cn-hzfinance' },
  { name: '上海金融云公网', value: 'oss-cn-shanghai-finance-1-pub' },
  { name: '深圳金融云公网', value: 'oss-cn-szfinance' },
  { name: '北京金融云公网', value: 'oss-cn-beijing-finance-1-pub' },
  { name: '华北2 阿里政务云1', value: 'oss-cn-north-2-gov-1' }
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
