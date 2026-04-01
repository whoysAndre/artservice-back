import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: envs.frontendUrl,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ArtService API')
    .setDescription(
      'Developer marketplace — customers find and contact freelance developers.\n\n' +
        '**Auth:** All protected endpoints require `Authorization: Bearer <token>`.\n' +
        'Obtain a token via `GET /api/auth/google` (browser OAuth flow).',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('auth', 'Google OAuth2 flow and JWT issuance')
    .addTag('users', 'User role management')
    .addTag('developer-profile', 'Developer profile CRUD and search')
    .addTag('portfolio', 'Developer portfolio projects')
    .addTag('reviews', 'Customer reviews on developer profiles')
    .addTag('contact', 'Send contact emails to developers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(envs.port);
}
bootstrap();
