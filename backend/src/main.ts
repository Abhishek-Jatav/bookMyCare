// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5000', // frontend port
    credentials: true, // allow cookies/auth headers if needed
  });

  await app.listen(4000);
}
bootstrap();
