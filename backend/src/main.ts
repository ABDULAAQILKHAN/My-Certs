import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


  const config = new DocumentBuilder()
    .setTitle("MyCerts")
    .setDescription('My Certs API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

    
    // Setup the Swagger module at the '/api-docs' endpoint
    // This sets up the endpoint for the user to access the API documentation
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);

      //Swagger setup and configuration
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);

      // Global validation pipe for DTO validation
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
