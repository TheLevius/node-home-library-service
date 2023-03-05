import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MyLoggerService } from './logger.service';
import { Request } from 'express';

@Catch()
export class MyExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly myLoggerService: MyLoggerService
    ) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const path = httpAdapter.getRequestUrl(ctx.getRequest());
        const request = ctx.getRequest<Request>();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            path,
            message: exception?.message || `Server Error`,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

        const logMessage = `Request URL: ${path} [${
            request.method
        }],\nRequest query params: ${JSON.stringify(
            request.query
        )},\nRequest body: ${JSON.stringify(
            request.body
        )},\nResponse statusCode: ${httpStatus}`;

        if (exception instanceof HttpException) {
            this.myLoggerService.warn(logMessage);
        } else {
            this.myLoggerService.error(logMessage);
        }
    }
}
