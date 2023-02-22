import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';

@Module({
    imports: [DbModule],
    controllers: [FavsController],
    providers: [FavsService],
})
export class FavsModule {}
