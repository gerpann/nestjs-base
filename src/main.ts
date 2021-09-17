import { NestFactory } from '@nestjs/core';
import { RequestMethod, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import setupSwagger from './setup-swagger';
import { IAppConfig } from './configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<IAppConfig> = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix(configService.get('apiPrefix'), {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  setupSwagger(app, configService.get('apiPrefix'));

  const port = configService.get('port');
  await app.listen(port, () => {
    const logger = new Logger();
    logger.log(`Server is running on port ${port}...`, 'StartApp');
  });
}
bootstrap();
