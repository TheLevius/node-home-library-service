import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private myLoggerService: MyLoggerService) {}
    use(req: Request, res: Response, next: () => void) {
        this.myLoggerService.setContext(req.baseUrl);
        this.myLoggerService.log(
            `Request URL: ${req.baseUrl} [${req.method}]`,
            req.baseUrl
        );
        this.myLoggerService.verbose(
            `Request URL: ${req.baseUrl} [${
                req.method
            }]\nRequest query: ${JSON.stringify(
                req.query
            )}\nRequest body: ${JSON.stringify(req.body, null, 2)}`,
            req.baseUrl
        );
        next();

        res.once('finish', () => {
            if (res.statusCode < 400) {
                this.myLoggerService.log(
                    `Response statusCode: ${res.statusCode}`,
                    req.baseUrl
                );
            }
        });
    }
}
