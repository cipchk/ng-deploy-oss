import { EnvName } from '../core/types';

/**
 * https://help.aliyun.com/document_detail/31837.html
 * ```js
 * var a = []; document.querySelectorAll('#tbody-2y5-xqs-4l8 tr').forEach(el => a.push({ name: el.querySelector('td:nth-child(1)').textContent, value: el.querySelector('td:nth-child(2)').textContent }));console.log(JSON.stringify(a));
 * ```
 */
export const REGIONS = [
  { name: '华东1（杭州）', value: 'oss-cn-hangzhou' },
  { name: '华东2（上海）', value: 'oss-cn-shanghai' },
  { name: '华北1（青岛）', value: 'oss-cn-qingdao' },
  { name: '华北2（北京）', value: 'oss-cn-beijing' },
  { name: '华北3（张家口）', value: 'oss-cn-zhangjiakou' },
  { name: '华北5（呼和浩特）', value: 'oss-cn-huhehaote' },
  { name: '华北6（乌兰察布）', value: 'oss-cn-wulanchabu' },
  { name: '华南1（深圳）', value: 'oss-cn-shenzhen' },
  { name: '华南2（河源）', value: 'oss-cn-heyuan' },
  { name: '西南1（成都）', value: 'oss-cn-chengdu' },
  { name: '中国（香港）', value: 'oss-cn-hongkong' },
  { name: '美国西部1（硅谷）', value: 'oss-us-west-1' },
  { name: '美国东部1（弗吉尼亚）', value: 'oss-us-east-1' },
  { name: '亚太东南1（新加坡）', value: 'oss-ap-southeast-1' },
  { name: '亚太东南2（悉尼）', value: 'oss-ap-southeast-2' },
  { name: '亚太东南3（吉隆坡）', value: 'oss-ap-southeast-3' },
  { name: '亚太东南5（雅加达）', value: 'oss-ap-southeast-5' },
  { name: '亚太东北1（日本）', value: 'oss-ap-northeast-1' },
  { name: '亚太南部1（孟买）', value: 'oss-ap-south-1' },
  { name: '欧洲中部1（法兰克福）', value: 'oss-eu-central-1' },
  { name: '英国（伦敦）', value: 'oss-eu-west-1' },
  { name: '中东东部1（迪拜）', value: 'oss-me-east-1' },
  { name: '华东1（杭州）', value: 'oss-cn-hangzhou' },
  { name: '华东2（上海）', value: 'oss-cn-shanghai' },
  { name: '华北1（青岛）', value: 'oss-cn-qingdao' },
  { name: '华北2（北京）', value: 'oss-cn-beijing' },
  { name: '华北 3（张家口）', value: 'oss-cn-zhangjiakou' },
  { name: '华北5（呼和浩特）', value: 'oss-cn-huhehaote' },
  { name: '华北6（乌兰察布）', value: 'oss-cn-wulanchabu' },
  { name: '华南1（深圳）', value: 'oss-cn-shenzhen' },
  { name: '华南2（河源）', value: 'oss-cn-heyuan' },
  { name: '西南1（成都）', value: 'oss-cn-chengdu' },
  { name: '中国（香港）', value: 'oss-cn-hongkong' },
  { name: '美国西部1（硅谷）', value: 'oss-us-west-1' },
  { name: '美国东部1（弗吉尼亚）', value: 'oss-us-east-1' },
  { name: '亚太东南1（新加坡）', value: 'oss-ap-southeast-1' },
  { name: '亚太东南2（悉尼）', value: 'oss-ap-southeast-2' },
  { name: '亚太东南3（吉隆坡）', value: 'oss-ap-southeast-3' },
  { name: '亚太东南5（雅加达）', value: 'oss-ap-southeast-5' },
  { name: '亚太东北1（日本）', value: 'oss-ap-northeast-1' },
  { name: '亚太南部1（孟买）', value: 'oss-ap-south-1' },
  { name: '欧洲中部1（法兰克福）', value: 'oss-eu-central-1' },
  { name: '英国（伦敦）', value: 'oss-eu-west-1' },
  { name: '中东东部1（迪拜）', value: 'oss-me-east-1' },
];

export const ENV_NAMES: EnvName[] = [
  { key: 'ALIOSS_REGION', name: 'region' },
  { key: 'ALIOSS_AK', name: 'ak' },
  { key: 'ALIOSS_SK', name: 'sk' },
  { key: 'ALIOSS_STSTOKEN', name: 'stsToken' },
  { key: 'ALIOSS_BUCKET', name: 'bucket' },
  { key: 'ALIOSS_PREFIX', name: 'prefix' },
  { key: 'ALIOSS_BUILDCOMMAND', name: 'buildCommand' },
];
