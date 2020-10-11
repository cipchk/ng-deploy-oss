# ng-deploy-oss

[![npm](https://img.shields.io/npm/v/ng-deploy-oss)](https://www.npmjs.com/package/ng-deploy-oss)
![CI](https://github.com/cipchk/ng-deploy-oss/workflows/CI/badge.svg)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/MIT)

**使用 Angular CLI 发布 Angular 应用到阿里云 OSS、七牛云、又拍云 🚀**

## 快速入门

1、安装 Angular CLI (v8.3.0 以上) 并创建一个新项目

```bash
npm install -g @angular/cli
ng new hello-world --defaults
cd hello-world
```

2、添加 `ng-deploy-oss`

```bash
ng add ng-deploy-oss
```

> 除 [通用参数](#通用参数) 以外，同时阿里云 OSS、七牛云、又拍云三种云存储，不同的类型需要的参数不同，更多细节请参考[不同参数](#不同参数)。

3、部署

```bash
ng deploy
```

## 参数

### 通用参数

| 参数名 | 默认值 | 描述 |
|-----|-----|----|
| `noBuild` | `false` | 是否不执行构建命令 |
| `buildCommand` | `-` | 自定义构建命令行 |
| `baseHref` | `-` | 指定 `baseHref` 参数，赞同 `ng build --base-href=xx` 值 |
| `preClean` | `true` | 是否预清除所有远程目录下的文件 |

### 不同参数

**阿里云 OSS**

| 参数名 | 环境变量名 | 描述 |
|-----|-------|----|
| `region` | `ALIOSS_REGION` | OSS Region，完整列表请参考[OSS 开通 Region 和 Endpoint 对照表](https://help.aliyun.com/document_detail/31837.html) |
| `ak` | `ALIOSS_AK` | 阿里云 AccessKeyId |
| `sk` | `ALIOSS_SK` | 阿里云 AccessKeySecret |
| `stsToken` | `ALIOSS_STSTOKEN` | 阿里云 STS Token |
| `bucket` | `ALIOSS_BUCKET` | Bucket |
| `prefix` | `ALIOSS_PREFIX` | 路径前缀，如果不指定表示放在根目录下 |
| `buildCommand` | `ALIOSS_BUILDCOMMAND` | 构建生产环境的 NPM 命令行（例如：`npm run build`），若为空表示自动根据 `angular.json` 构建生成环境 |

**七牛云**

| 参数名 | 环境变量名 | 描述 |
|-----|-------|----|
| `ak` | `QINIU_AK` | 七牛云 AccessKey |
| `sk` | `QINIU_SK` | 七牛云 SecretKey |
| `zone` | `QINIU_ZONE` | 所在机房 |
| `bucket` | `QINIU_BUCKET` | Bucket |
| `prefix` | `QINIU_PREFIX` | 路径前缀，如果不指定表示放在根目录下 |
| `buildCommand` | `QINIU_BUILDCOMMAND` | 构建生产环境的 NPM 命令行（例如：`npm run build`），若为空表示自动根据 `angular.json` 构建生成环境 |

**又拍云**

| 参数名 | 环境变量名 | 描述 |
|-----|-------|----|
| `name` | `UPYUN_NAME` | 服务名称 |
| `operatorName` | `UPYUN_OPERATORNAME` | 操作员名称（确保可写入&可删除权限） |
| `operatorPwd` | `UPYUN_OPERATORPWD` | 操作员密码 |
| `prefix` | `UPYUN_PREFIX` | 路径前缀，如果不指定表示放在根目录下 |
| `buildCommand` | `UPYUN_BUILDCOMMAND` | 构建生产环境的 NPM 命令行（例如：`npm run build`），若为空表示自动根据 `angular.json` 构建生成环境 |

### 使用环境变量

当运行 `ng add ng-deploy-oss` 时会根据所选的类型提示输入相应的参数，并把这些参数写入 `angular.json` 中。事实上，对于这些参数属于私密强的信息，这时候可以利用环境变量，来保护这些私密信息。

例如，当生产环境部署时，使用不同的 `ALIOSS_AK` 参数时：

```bash
# Windows：
set ALIOSS_AK=prod
# on OS X or Linux：
export ALIOSS_AK=prod
```

### 使用命令行

命令行参数也可以改变其参数值，但它的优先级会低于环境变量方式，高于 `angular.json` 配置的信息。

```bash
ng deploy --ak=prod
```

## License

The MIT License (see the [LICENSE](https://github.com/cipchk/ng-deploy-oss/blob/master/LICENSE) file for the full text)
