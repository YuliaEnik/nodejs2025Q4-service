import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('The home library API description')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);

    writeFileSync('./doc/api.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`OpenAPI documentation: http://localhost:${port}/doc`);
  console.log(`OpenAPI spec saved to: doc/api.json`);
}
bootstrap();
