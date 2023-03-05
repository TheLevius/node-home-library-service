import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
// import { MyLoggerService } from './logger/logger.service';
config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    // app.useLogger(app.get(MyLoggerService));
    await app.listen(+process.env?.PORT || 4000);
}
bootstrap();
