import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Law School Voting API')
    .setDescription('Vote!')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const swagDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, swagDocument);

  await app.listen(3000);
}
bootstrap();
