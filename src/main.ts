import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MESSAGE_QUEUE, MicroserviceOptions, Transport } from '@chatbot/shared-lib';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: MESSAGE_QUEUE,
    },
  });
  await app.startAllMicroservices();
  
  await app.listen(3000);
}
bootstrap();
