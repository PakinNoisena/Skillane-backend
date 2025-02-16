import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // zod validation
  app.useGlobalPipes(new ZodValidationPipe());

  // routing prefix
  app.setGlobalPrefix('skillane');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
