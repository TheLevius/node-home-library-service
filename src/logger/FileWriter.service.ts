import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { EOL } from 'node:os';
import { resolve } from 'node:path';

@Injectable()
export class FileWriter {
    logDirectoryPath = resolve(process.cwd(), 'logs');
    nameLogFile: string;
    nameErrorFile: string;
    constructor() {
        this.createDirectory();
    }
    async write(message: string, type: string) {
        if (type === 'log') {
            await this.writeStreamLog(message);
        } else {
            await this.writeStreamError(message);
        }
    }

    async createDirectory() {
        try {
            await mkdir(this.logDirectoryPath);
            console.log(`Directory was created: ${this.logDirectoryPath}`);
        } catch (err) {
            console.log('Directory already exist');
        }
    }

    async writeStreamLog(message: string) {
        if (!this.nameLogFile) {
            this.nameLogFile = new Date().toJSON();
        }

        const pathToFile = resolve(
            this.logDirectoryPath,
            `${this.nameLogFile}.txt`
        );

        await this.checkSize(pathToFile, message, false);

        const ws = createWriteStream(pathToFile, {
            flags: 'a',
        });
        ws.write(message + EOL);
    }

    async writeStreamError(message: string) {
        if (!this.nameErrorFile) {
            this.nameErrorFile = new Date().toJSON();
        }

        const pathToFile = resolve(
            this.logDirectoryPath,
            'errors',
            `${this.nameErrorFile}.txt`
        );

        await this.checkSize(pathToFile, message, true);

        const ws = createWriteStream(pathToFile, {
            flags: 'a',
        });
        ws.write(message + EOL);
    }

    async checkSize(pathToFile: string, msg: string, errorStream: boolean) {
        let fileSize: number;
        try {
            const fileStat = await stat(pathToFile);
            fileSize = fileStat.size;
        } catch (error) {
            if (error.code === 'ENOENT') {
                fileSize = 0;
            } else
                throw new InternalServerErrorException('Internal server error');
        }
        const msgSize = Buffer.byteLength(msg, 'utf-8');
        if (fileSize + msgSize > +process.env.MAX_SIZE_LOG_FILE) {
            if (errorStream) {
                this.nameErrorFile = new Date().toJSON();
            } else this.nameLogFile = new Date().toJSON();
        }
    }
}
