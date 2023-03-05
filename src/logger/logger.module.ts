import { Module } from '@nestjs/common';
import { FileWriter } from './FileWriter.service';
import { LoggerMiddleware } from './logger.middleware';
import { MyLoggerService } from './logger.service';
import { MyExceptionFilter } from './MyExceptionsFilter.service';

@Module({
    providers: [
        MyLoggerService,
        LoggerMiddleware,
        MyExceptionFilter,
        FileWriter,
    ],
    exports: [MyLoggerService, LoggerMiddleware, MyExceptionFilter, FileWriter],
})
export class LoggerModule {}
