import { Module } from '@nestjs/common';
import { DbController } from './db.controller';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService],
    controllers: [DbController],
    exports: [PrismaService],
})
export class DbModule {}
