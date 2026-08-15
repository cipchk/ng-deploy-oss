import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';

import { execSync } from 'child_process';

import { ngDeployAliOSS } from '../ali-oss/deploy';
import { DeployBuilderSchema } from '../core/types';
import { fixAdditionalProperties } from '../core/utils';
import { ngDeployQiniu } from '../qiniu/deploy';
import { ngDeployUpyun } from '../upyun/deploy';

async function build(schema: DeployBuilderSchema, context: BuilderContext): Promise<BuilderOutput | void> {
  context.logger.info(`🥶Executing ${schema.type} deploy...`);
  if (schema.noBuild) {
    context.logger.info(`😀Skipping build`);
    return;
  }

  if (schema.buildCommand) {
    context.logger.info(`📦Building via "${schema.buildCommand}"`);

    execSync(schema.buildCommand);
    context.logger.info(`😍Build Completed`);
    return;
  }

  const configuration = schema.configuration || 'production';

  const overrides = {
    // this is an example how to override the workspace set of options
    ...(schema.baseHref && { baseHref: schema.baseHref })
  };

  if (!context.target) {
    throw new Error('Cannot build the application without a target');
  }

  const baseHref = schema.baseHref ? `Your base-href: "${schema.baseHref}` : '';
  context.logger.info(`📦Building "${context.target.project}". Configuration: "${configuration}". ${baseHref}`);

  const buildTarget = await context.scheduleTarget(
    {
      target: 'build',
      project: context.target.project || '',
      configuration
    },
    overrides as json.JsonObject
  );

  const buildResult = await buildTarget.result;

  if (buildResult.success !== true) {
    context.logger.error(`❌Application build failed`);
    return {
      error: `❌Application build failed`,
      success: false
    };
  }

  context.logger.info(`😍Build Completed`);
}

// Call the createBuilder() function to create a builder. This mirrors
// createJobHandler() but add typings specific to Architect Builders.
export default createBuilder<any>(
  async (schema: DeployBuilderSchema, context: BuilderContext): Promise<BuilderOutput> => {
    fixAdditionalProperties(schema);
    await build(schema, context);
    switch (schema.type) {
      case 'qiniu':
        await ngDeployQiniu(schema as any, context);
        break;
      case 'upyun':
        await ngDeployUpyun(schema as any, context);
        break;
      case 'ali-oss':
        await ngDeployAliOSS(schema as any, context);
        break;
      default:
        context.logger.error(`Invalid cloud type "${schema.type}"`);
        break;
    }
    return { success: true };
  }
);
