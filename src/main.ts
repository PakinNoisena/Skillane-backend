import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // zod validation
  app.useGlobalPipes(new ZodValidationPipe());

  // cookie parser
  app.use(CookieParser());

  // routing prefix
  app.setGlobalPrefix('skillane');

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
