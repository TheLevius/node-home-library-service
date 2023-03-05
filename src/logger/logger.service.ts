import {
    ConsoleLogger,
    ConsoleLoggerOptions,
    Injectable,
    Scope,
    LogLevel,
} from '@nestjs/common';
import { FileWriter } from './FileWriter.service';
const levels: LogLevel[] = ['error', 'warn', 'log', 'verbose', 'debug'];
@Injectable({ scope: Scope.TRANSIENT })
export class MyLoggerService extends ConsoleLogger {
    private logLevels: LogLevel[];
    constructor(
        context: string,
        options: ConsoleLoggerOptions,
        private fileWriter: FileWriter
    ) {
        const logLevels =
            levels.slice(0, +process.env.LOG_LEVEL || 5) || levels;
        super(context, { ...options, logLevels });
        this.logLevels = logLevels;
    }

    error(message: string) {
        super.error(message);
        if (this.logLevels.includes('error')) {
            this.fileWriter.write(message, 'error');
        }
    }

    warn(message: string) {
        super.warn(message);
        if (this.logLevels.includes('warn')) {
            this.fileWriter.write(message, 'log');
        }
    }

    log(message: string, url: string) {
        super.log(message);
        if (this.logLevels.includes('log')) {
            this.fileWriter.write(`${url}:\n${message}`, 'log');
        }
    }

    verbose(message: string, url: string) {
        super.verbose(message);
        if (this.logLevels.includes('verbose')) {
            this.fileWriter.write(`${url}:\n${message}`, 'log');
        }
    }

    debug(message: string) {
        super.debug(message);
        if (this.logLevels.includes('debug')) {
            this.fileWriter.write(message, 'log');
        }
    }
}
