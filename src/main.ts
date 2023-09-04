import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ErrorInterceptor(),
    new RequestInterceptor(),
    new ResponseInterceptor(),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const swagTitle = configService.get('swagger.title');
  const swagDescription = configService.get('swagger.description');
  const appVersion = configService.get('swagger.version');
  const appPort = configService.get('app.port');
  const environment = configService.get('environment');

  const initSwagger = (
    app: INestApplication,
    swaggerConfig: {
      title: string;
      description: string;
      version: string;
    },
  ) => {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();

    const swagDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger', app, swagDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  };

  if (environment !== 'production') {
    initSwagger(app, {
      description: swagDescription,
      title: swagTitle,
      version: appVersion,
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(appPort);
}
bootstrap();
